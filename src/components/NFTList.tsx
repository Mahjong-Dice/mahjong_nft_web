
/**
 * 展示用户的 NFT 列表
 * @return {*} 
 */

import { useEffect } from 'react'
import { useReadContract, useChainId } from 'wagmi'
import mahjongNFTAbi from '@/abi/mahjongNFT'

function NFTList() {
    const chainId = useChainId()

    const { data, isError, isPending, refetch } = useReadContract({
        // @ts-ignore
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: mahjongNFTAbi.abi,
        chainId,
        functionName: "getOwnedCIDs"
    })
    useEffect(() => {
        console.log("data", data)
    }, [data])
    

    return (
        <div className="nft-list-container">
            {/* 渲染 NFT 列表 */}
            {/* {nftList.map((nft, index) => (
                <NFTItem key={index} nft={nft} />
            ))} */}
            NFTLIST
        </div>
    );
}

export default NFTList;