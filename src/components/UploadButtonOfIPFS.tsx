"use client";
import { useAccount, useWatchContractEvent } from "wagmi";
import mahjongNFTAbi from "@/abi/mahjongNFT";
import { parseEther } from "viem";
import { memo, useRef, useState } from "react";
import CreateNFTForm, { Metadata } from "@/components/CreateNFTForm";
import { useContractWrite } from "@/hooks/useContractWrite";
import { useMutation } from "@apollo/client";
import { CREATE_NFT } from "@/lib/api";

function UploadButtonOfIPFS() {
  const { writeContractWithPromise } = useContractWrite();
  const account = useAccount();
  // const chainId = useChainId()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const metadataRef = useRef({});

  // 上传成功后调用, 铸造NFT
  const [createNFT] = useMutation(CREATE_NFT);

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: mahjongNFTAbi.abi,
    eventName: "NFTMinted",
    onLogs: async (logs) => {
      const {
        args: { tokenId },
      } = logs[0];
      console.log("NFTMinted", tokenId);

      if (metadataRef.current && tokenId) {
        console.log("save mint info to db");
        // console.log(metadataRef.current, tokenId.toString());
        const input = {
          tokenId: tokenId.toString(),
          contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          metadata: JSON.stringify(metadataRef.current),
          owner: account.address,
          creator: account.address,
        };
        createNFT({
          variables: {
            input,
          },
        });
        window.$message.success("mint success");
      }
    },
  });

  const handleUploadIPFSSuccess = async (metadata: Metadata) => {
    const { metadataCid, ...nftMetadata } = metadata;
    metadataRef.current = nftMetadata;

    // 添加判断确保所有必要数据都存在
    if (!account.address || !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      console.error("Missing required data");
      return;
    }
    // 直接构造 mint 请求
    await writeContractWithPromise({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: mahjongNFTAbi.abi,
      functionName: "mint",
      args: [metadataCid],
      value: parseEther("0.001"),
    })
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        Mint NFT
      </button>
      <CreateNFTForm
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUploadIPFSSuccess}
      />
    </div>
  );
}

export default memo(UploadButtonOfIPFS);
