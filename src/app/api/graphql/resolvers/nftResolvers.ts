import prisma from "@/lib/prisma";
import type {
  INFTCreateRequest,
  IListingCreateRequest,
  IListing,
} from "@/styles/grahpQL";

export const resolvers = {
  Query: {
    nfts: async (_: any, { filter }: { filter?: any }) => {
      const where = filter || {};
      return await prisma.nFT.findMany({
        where,
        include: {
          listing: true,
          transactions: true,
        },
      });
    },
    nft: async (_: any, { id }: { id: string }) => {
      return await prisma.nFT.findUnique({
        where: { id },
      });
    },
    listings: async (_: any, { filter }: { filter?: IListing }) => {
      const where: any = {};

      if (filter) {
        where.nftId = filter.nftId;
        where.seller = filter.seller;
        if (filter.isActive !== undefined) {
          where.isActive = filter.isActive;
        }
      }

      return await prisma.listing.findMany({
        where,
        include: { nft: true }, // 根据 Prisma 模型关系配置
      });
    },

    listing: async (_: any, { id }: { id: string }) => {
      return await prisma.listing.findUnique({
        where: { id },
        include: { nft: true },
      });
    },
  },
  Mutation: {
    createNFT: async (_: any, { input }: { input: INFTCreateRequest }) => {
      try {
        return await prisma.nFT.create({
          data: {
            ...input,
          },
        });
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new Error("NFT with these details already exists");
        }
        throw error;
      }
    },
    deleteNFTs: async (_: any, { id }: { id: string }) => {
      const result = await prisma.nFT.deleteMany({
        where: {
          id,
        },
      });

      return {
        count: result.count,
      };
    },
    createListing: async (
      _: any,
      { input }: { input: IListingCreateRequest }
    ) => {
      // 检查 NFT 是否存在
      const existingNFT = await prisma.nFT.findUnique({
        where: { id: input.nftId },
      });
      console.log("existingNFT", !existingNFT, input);
      if (!existingNFT) {
        throw new Error("NFT not found");
      }

      return await prisma.listing.create({
        data: {
          ...input,
          isActive: true, // 默认激活状态
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    },

    updateListing: async (
      _: any,
      { id, price }: { id: string; price?: number }
    ) => {
      const existingListing = await prisma.listing.findUnique({
        where: { id },
      });

      if (!existingListing) {
        throw new Error("Listing not found");
      }

      return await prisma.listing.update({
        where: { id },
        data: {
          price: price ?? existingListing.price, // 保留原值如果未提供
          updatedAt: new Date(),
        },
      });
    },

    deactivateListing: async (_: any, { id }: { id: string }) => {
      const existingListing = await prisma.listing.findUnique({
        where: { id },
      });

      if (!existingListing) {
        throw new Error("Listing not found");
      }

      return await prisma.listing.delete({
        where: { id },
      });
    },
    executeTransaction: async (
      _: any,
      {
        input,
      }: {
        input: {
          nftId: string;
          fromAddress: string;
          toAddress: string;
          price: number;
        };
      }
    ) => {
      try {
        console.log("Transaction params:", input);
        // 添加参数验证
        if (!input || !input.nftId) {
          throw new Error("NFT ID is required");
        }

        const { nftId, fromAddress, toAddress, price } = input;

        return await prisma.$transaction(
          async (tx) => {
            // 1. 验证 NFT 存在性和所有权
            const nft = await tx.nFT.findUnique({
              where: { id: nftId },
              include: { listing: true },
            });

            if (!nft) {
              throw new Error("NFT not found");
            }

            if (nft.owner !== fromAddress) {
              throw new Error("Seller is not the owner of the NFT");
            }

            // 2. 创建交易记录
            const newTransaction = await tx.transaction.create({
              data: {
                nftId,
                fromAddress,
                toAddress,
                price,
              },
            });

            // 3. 更新 NFT 所有者
            const updatedNFT = await tx.nFT.update({
              where: { id: nftId },
              data: {
                owner: toAddress,
                updatedAt: new Date(),
              },
            });

            // 4. 如果存在相关的 listing，将其设置为非活跃
            if (nft.listing) {
              await tx.listing.update({
                where: { nftId },
                data: {
                  isActive: false,
                  updatedAt: new Date(),
                },
              });
            }

            return newTransaction;
          },
          {
            timeout: 10000, // 10秒超时
          }
        );
      } catch (error: any) {
        console.error("Transaction failed:", error);
        throw error;
      }
    },
  },
  Listing: {
    nft: async (parent: any) => {
      return await prisma.nFT.findUnique({
        where: { id: parent.nftId },
      });
    },
  },
  NFT: {
    listing: async (parent: any) => {
      return await prisma.listing.findUnique({
        where: { nftId: parent.id, isActive: true },
      });
    },
    transactions: async (parent: any) => {
      return await prisma.transaction.findMany({
        where: { nftId: parent.id },
      });
    },
  },
};
