
/**
 * 展示用户的 NFT 列表
 */

import { memo, useEffect, useState } from 'react'
import { useChainId, useAccount, useWatchContractEvent } from 'wagmi'
// import mahjongNFTAbi from '@/abi/mahjongNFT'
import NFTItem, { NFTItemProps } from './NFTItem'
import { useQuery } from '@apollo/client'
import { GET_NFTS } from '@/lib/api'
import mahjongNFT from '@/abi/mahjongNFT'

const ipfsGateway = process.env.NEXT_PUBLIC_IPFS_Gateway

function NFTList() {
    const { address } = useAccount()
    const chainId = useChainId()
    const [nftList, setNftList] = useState<NFTItemProps[]>([])
    // const [isLoading, setIsLoading] = useState(false)
    // const { data, isError, isPending, refetch } = useReadContract({
    //     // @ts-ignore
    //     address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    //     abi: mahjongNFTAbi.abi,
    //     chainId,
    //     functionName: "getOwnedCIDs",
    //     args: [address as `0x${string}`] as const,
    // })
    useWatchContractEvent({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: mahjongNFT.abi,
        chainId,
        eventName: "NFTMinted",
        onLogs: (logs) => {
            console.log("NFTMinted", logs)
            refetch()
        }
    })
    const { data, loading: isPending, error: isError, refetch } = useQuery(GET_NFTS, {
        variables: {
            filter: {
                owner: address,
                contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
            }
        }
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
        try {
            console.log("cids", data, "\n")
            if (!data || !Array.isArray(data.nfts)) return
            // 重置 NFT 列表
            setNftList([])

            // 为每个 CID 创建单独的获取过程
            const nfts = data.nfts.map((item: { metadata: any }) => item.metadata).filter(Boolean).map(JSON.parse);
            console.log("nfts", nfts)
            setNftList(nfts);

            // nfts.forEach(async (cid, index) => {
            //     try {
            //         if (!cid) return;
            //         console.log(cid)
            //         // setNftList(cid)
            //         // const metadata = await fetchMetadata(cid)
            //         // if (metadata) {
            //         //     setNftList(prev => [...prev, metadata])
            //         // }
            //     } catch (error) {
            //         console.error(`Error loading NFT metadata for CID ${cid}:`, error)
            //     } finally {
            //         // 当最后一个 NFT 加载完成时，设置 loading 为 false
            //         // if (index === data.length - 1) {
            //         //     setIsLoading(false)
            //         // }
            //     }
            // })
        } catch (error) {
            console.error(error)
        }
    }, [data])

    if (isError) {
        return <div>Error loading NFTs</div>
    }

    if (isPending) {
        return <div className='text-white'>Loading...</div>
    }
    return (
        <div className="nft-list-container">
            {/* 渲染 NFT 列表 */}
            <h1 className='text-white text-2xl font-bold'>我的NFT</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {nftList.map((nft, index) => (
                    <NFTItem key={index} {...nft} />
                ))}
            </div>
        </div>
    );
}

export default memo(NFTList);