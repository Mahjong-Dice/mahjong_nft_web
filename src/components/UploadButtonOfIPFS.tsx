"use client";
import { useWriteContract, useAccount } from "wagmi";
import mahjongNFTAbi from "@/abi/mahjongNFT";
import { parseEther } from "viem";
import { memo, useState } from "react";
import CreateNFTForm, { Metadata } from "@/components/CreateNFTForm";
import { message } from "antd";

import { useMutation } from "@apollo/client";
import { CREATE_NFT } from "@/lib/api";

function UploadButtonOfIPFS() {
  const account = useAccount();
  // const chainId = useChainId()
  const { writeContract } = useWriteContract();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 上传成功后调用, 铸造NFT
  const [createNFT] = useMutation(CREATE_NFT);

  // const { data: simulateData } = useSimulateContract({
  //     address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  //     abi: mahjongNFTAbi.abi,
  //     chainId,
  //     functionName: "mint",
  //     value: parseEther('0.001'),
  //     // @ts-ignore
  //     enabled: true, // 只有当 ipfsPath 存在时才执行
  // })

  const handleUploadIPFSSuccess = (metadata: Metadata) => {
    const { metadataCid, ...nftMetadata } = metadata;

    // console.log("account", account.address, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
    // 添加判断确保所有必要数据都存在
    if (!account.address || !process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      console.error("Missing required data");
      return;
    }
    // 直接构造 mint 请求
    writeContract(
      {
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: mahjongNFTAbi.abi,
        functionName: "mint",
        args: [metadataCid],
        value: parseEther("0.001"),
      },
      {
        onSuccess: async (data) => {
          console.log("mint success", data);
          // 存储到数据库中
          await createNFT({
            variables: {
              input: {
                tokenId: data,
                contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
                metadata: JSON.stringify(nftMetadata),
                owner: account.address,
                creator: account.address,
              },
            },
          });
          message.success("mint success");
        },
        onError: (err) => {
          console.log("mint error", err);
        },
      }
    );
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
