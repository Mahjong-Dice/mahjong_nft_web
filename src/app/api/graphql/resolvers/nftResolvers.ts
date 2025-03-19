import prisma from '@/lib/prisma'
import type { INFTCreateRequest, IListingCreateRequest, IListing } from '@/app/api/nfts/interface'

export const resolvers = {
    Query: {
        nfts: async (_: any, { filter }: { filter?: any }) => {
            const where = filter || {};
            return await prisma.nFT.findMany({ 
                where,
                include: {
                    listings: true // 包含关联的 listings
                }
            })
        },
        nft: async (_: any, { id }: { id: string }) => {
            return await prisma.nFT.findUnique({
                where: { id }
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
                include: { nft: true } // 根据 Prisma 模型关系配置
            });
        },

        listing: async (_: any, { id }: { id: string }) => {
            return await prisma.listing.findUnique({
                where: { id },
                include: { nft: true }
            });
        }
    },
    Mutation: {
        createNFT: async (_: any, { input }: { input: INFTCreateRequest }) => {
            try {
                return await prisma.nFT.create({
                    data: {
                        ...input
                    }
                });
            } catch (error: any) {
                if (error.code === 'P2002') {
                    throw new Error('NFT with these details already exists');
                }
                throw error;
            }
        },
        deleteNFTs: async (_: any, { id }: { id: string }) => {
            const result = await prisma.nFT.deleteMany({
                where: {
                    id
                }
            });

            return {
                count: result.count
            };
        },
        createListing: async (_: any, { input }: { input: IListingCreateRequest }) => {
            // 检查 NFT 是否存在
            const existingNFT = await prisma.nFT.findUnique({
                where: { id: input.nftId }
            });

            if (!existingNFT) {
                throw new Error('NFT not found');
            }

            return await prisma.listing.create({
                data: {
                    ...input,
                    isActive: true,  // 默认激活状态
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        },

        updateListing: async (_: any, { id, price }: { id: string; price?: number }) => {
            const existingListing = await prisma.listing.findUnique({
                where: { id }
            });

            if (!existingListing) {
                throw new Error('Listing not found');
            }

            return await prisma.listing.update({
                where: { id },
                data: {
                    price: price ?? existingListing.price, // 保留原值如果未提供
                    updatedAt: new Date()
                }
            });
        },

        deactivateListing: async (_: any, { id }: { id: string }) => {
            const existingListing = await prisma.listing.findUnique({
                where: { id }
            });

            if (!existingListing) {
                throw new Error('Listing not found');
            }

            return await prisma.listing.update({
                where: { id },
                data: {
                    isActive: false,
                    updatedAt: new Date()
                }
            });
        }
    },
    Listing: {
        nft: async (parent: any) => {
            return await prisma.nFT.findUnique({
                where: { id: parent.nftId }
            });
        }
    },
    NFT: {
        listings: async (parent: any) => {
            return await prisma.listing.findMany({
                where: { nftId: parent.id }
            });
        }
    }
};
