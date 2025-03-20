import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { INFTCreateRequest } from '../../../styles/grahpQL.js'

export async function POST(request: NextRequest) {
    try {
        const body: INFTCreateRequest = await request.json();

        const { tokenId, contractAddress, metadata, owner, creator } = body;

        if (!tokenId || !contractAddress || !metadata || !owner || !creator) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newNFT = await prisma.nFT.create({
            data: {
                tokenId,
                contractAddress,
                metadata,
                owner,
                creator
            }
        });

        return NextResponse.json({
            message: "NFT 创建成功",
            nft: newNFT
        });
    } catch (error) {
        console.error("创建 NFT 时出错:", error);
        return NextResponse.json(
            { error: "创建 NFT 失败" },
            { status: 500 }
        );
    }
}

// 如果你需要支持 GET 请求，添加这个函数
export async function GET() {
    // 这里可以添加获取 NFT 列表的逻辑
    return NextResponse.json({ message: "NFT list endpoint" });
}