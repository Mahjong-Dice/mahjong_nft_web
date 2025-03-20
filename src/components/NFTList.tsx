/**
 * 展示用户的 NFT 列表
 */

import { memo, useEffect, useState } from "react";
import { useChainId, useAccount, useWatchContractEvent } from "wagmi";
// import mahjongNFTAbi from '@/abi/mahjongNFT'
import NFTItem from "./NFTItem";
import { useQuery } from "@apollo/client";
import { GET_NFTS } from "@/lib/api";
import mahjongNFT from "@/abi/mahjongNFT";
import { INFTResponse } from "@/styles/grahpQL";

function NFTList() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [nftList, setNftList] = useState<INFTResponse[]>([]);
  const privateNftList = nftList.filter(item => item.owner === address);
  const activeNftList = nftList.filter(item => item.listing?.isActive);

  // 调用后端接口获取用户的 NFT 列表
  const {
    data,
    loading: isPending,
    error: isError,
    refetch,
  } = useQuery(GET_NFTS, {
    variables: {
      filter: {
        // owner: address,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      },
    },
  });
  // 监听 NFT 创建事件
  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: mahjongNFT.abi,
    eventName: "NFTMinted",
    onLogs: () => {
      setTimeout(async () => {
        await refetch();
      }, 1000);
    },
  });

  useEffect(() => {
    refetch();
  }, [chainId])

  useEffect(() => {
    try {
      console.log("cids", data, "\n");
      if (!data || !Array.isArray(data.nfts)) return;
      // 重置 NFT 列表
      setNftList([]);

      // 为每个 CID 创建单独的获取过程
      const nfts: INFTResponse[] = data.nfts;
      const newNfts: INFTResponse[] = [];
      nfts.forEach(async (nft) => {
        const { metadata } = nft;
        if (typeof metadata === "string") {
          const newMetadata = JSON.parse(metadata);
          newNfts.push({ ...nft, metadata: newMetadata });
        }
      });
      setNftList(newNfts);
    } catch (error) {
      console.error(error);
    }
  }, [data, address]);

  if (isError) {
    return <div>Error loading NFTs</div>;
  }

  if (isPending) {
    return <div className="text-white">Loading...</div>;
  }
  return (
    <div className="nft-list-container">
      <h1 className="text-white text-2xl font-bold">NFT上架列表</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {
          activeNftList.map((nft, index) => (
            <NFTItem key={index} nft={nft} />
          ))
        }
      </div>
      {/* 渲染 NFT 列表 */}
      <h1 className="text-white text-2xl font-bold">我的NFT</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {privateNftList.map((nft, index) => (
          <NFTItem key={index} nft={nft} isOwner/>
        ))}
      </div>
    </div>
  );
}

export default memo(NFTList);
