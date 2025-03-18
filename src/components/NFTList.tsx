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
import { I_NFT } from "@/types";

function NFTList() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [nftList, setNftList] = useState<I_NFT[]>([]);

  // 调用后端接口获取用户的 NFT 列表
  const {
    data,
    loading: isPending,
    error: isError,
    refetch,
  } = useQuery(GET_NFTS, {
    variables: {
      filter: {
        owner: address,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      },
    },
  });
  // 监听 NFT 创建事件
  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: mahjongNFT.abi,
    chainId,
    eventName: "NFTMinted",
    onLogs: () => {
      setTimeout(async () => {
        await refetch();
      }, 1000);
    },
  });

  //   const fetchMetadata = async (cid: string) => {
  //     try {
  //       const response = await fetch(`${ipfsGateway}/${cid}`);
  //       const metadata = await response.json();
  //       return { ...metadata, cid };
  //     } catch (error) {
  //       console.error("Error fetching metadata:", error);
  //       return null;
  //     }
  //   };

  useEffect(() => {
    try {
      console.log("cids", data, "\n");
      if (!data || !Array.isArray(data.nfts)) return;
      // 重置 NFT 列表
      setNftList([]);

      // 为每个 CID 创建单独的获取过程
      const nfts: I_NFT[] = data.nfts;
      const newNfts: I_NFT[] = [];
      nfts.forEach(async (nft) => {
        const { metadata } = nft;
        if (typeof metadata === "string") {
          const newMetadata = JSON.parse(metadata);
          newNfts.push({ ...nft, metadata: newMetadata });
        }
      });
      setNftList(newNfts);
      //   const metadataArray = data.nfts
      //     .map((item: any) => item.metadata)
      //     .filter(Boolean)
      //     .map(JSON.parse);
      //   setNftList(metadataArray);

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
      console.error(error);
    }
  }, [data]);

  if (isError) {
    return <div>Error loading NFTs</div>;
  }

  if (isPending) {
    return <div className="text-white">Loading...</div>;
  }
  return (
    <div className="nft-list-container">
      {/* 渲染 NFT 列表 */}
      <h1 className="text-white text-2xl font-bold">我的NFT</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {nftList.map((nft, index) => (
          <NFTItem key={index} nft={nft} />
        ))}
      </div>
    </div>
  );
}

export default memo(NFTList);
