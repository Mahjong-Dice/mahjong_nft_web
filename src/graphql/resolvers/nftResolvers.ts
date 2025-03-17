import prisma from '@/lib/prisma'
import type { INFTCreateRequest } from '@/app/api/nfts/interface'

export const resolvers = {
    Query: {
        nfts: async (_: any, { filter }: any) => {
            const where = filter || {};
            return await prisma.nFT.findMany({where})
        },
        nft: async (_: any, { id }: { id: string }) => {
            return await prisma.nFT.findUnique({
                where: { id }
            });
        }
    },
    Mutation: {
        createNFT: async (_: any, { input }: { input: INFTCreateRequest }) => {
            return await prisma.nFT.create({
                data: {
                    ...input
                }
            })
        }
    }
}