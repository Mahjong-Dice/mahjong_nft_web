import prisma from '@/lib/prisma'
import type { INFTCreateRequest } from '@/app/api/nfts/interface'

export const resolvers = {
    Query: {
        nfts: async (_: any, { filter }: { filter?: any }) => {
            const where = filter || {};
            return await prisma.nFT.findMany({ where })
        },
        nft: async (_: any, { id }: { id: string }) => {
            return await prisma.nFT.findUnique({
                where: { id }
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
    },
    NFT: {
        listings: async (parent: any) => {
            return await prisma.listing.findMany({
                where: {
                    nftId: parent.id
                }
            });
        }
    }
}