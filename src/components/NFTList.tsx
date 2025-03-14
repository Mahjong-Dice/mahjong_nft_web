
/**
 * 展示用户的 NFT 列表
 */

import { memo, useEffect, useState } from 'react'
import { useReadContract, useChainId, useAccount } from 'wagmi'
import mahjongNFTAbi from '@/abi/mahjongNFT'
import NFTItem, { NFTItemProps } from './NFTItem'

const ipfsGateway = process.env.NEXT_PUBLIC_IPFS_Gateway

function NFTList() {
    const { address } = useAccount()
    const chainId = useChainId()
    const [nftList, setNftList] = useState<NFTItemProps[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { data, isError, isPending, refetch } = useReadContract({
        // @ts-ignore
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: mahjongNFTAbi.abi,
        chainId,
        functionName: "getOwnedCIDs",
        args: [address],
    })
    const fetchMetadata = async (cid: string) => {
        try {
            const response = await fetch(`${ipfsGateway}/${cid}`)
            const metadata = await response.json()
            return { ...metadata, cid }
        } catch (error) {
            console.error('Error fetching metadata:', error)
            return null
        }
    }

    useEffect(() => {
        if (!data || !Array.isArray(data)) return
        setIsLoading(true)
        console.log("cids", data)
        // 重置 NFT 列表
        setNftList([])

        // 为每个 CID 创建单独的获取过程
        data.forEach(async (cid, index) => {
            try {
                const metadata = await fetchMetadata(cid)
                if (metadata) {
                    setNftList(prev => [...prev, metadata])
                }
            } catch (error) {
                console.error(`Error loading NFT metadata for CID ${cid}:`, error)
            } finally {
                // 当最后一个 NFT 加载完成时，设置 loading 为 false
                if (index === data.length - 1) {
                    setIsLoading(false)
                }
            }
        })
    }, [data])

    return (
        <div className="nft-list-container">
            {/* 渲染 NFT 列表 */}
            <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {nftList.map((nft, index) => (
                    <NFTItem key={index} {...nft} />
                ))}
            </div>
        </div>
    );
}

export default memo(NFTList);