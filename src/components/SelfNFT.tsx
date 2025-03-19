import React, { memo, useEffect, useState } from "react";
import { Button, Input, message, Modal } from "antd";

import { useWriteContract, useChainId, useWatchContractEvent, useReadContract, useSignMessage } from "wagmi";
import { encodeAbiParameters, keccak256, parseEther } from "viem";
import configAbi from '@/abi/mahjongNFT'
import { config } from "@/wagmi";
import { useContractWrite, useApprove } from "@/hooks/useContractWrite";

interface SelfNFTProps {
  name: string;
  tokenId: string;
}

const ORDER_PARAMS = [
  { name: "contract_", type: "address" },
  { name: "tokenIds", type: "uint256[]" },
  { name: "price", type: "uint256" },
  { name: "expiry", type: "uint256" }
];
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;


const SelfNFT: React.FC<SelfNFTProps> = ({ name, tokenId }) => {
  const { writeContractWithPromise } = useContractWrite()
  const { approve } = useApprove()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { writeContract, data, error } = useWriteContract({ config });
  const { signMessage, data: signData } = useSignMessage()
  const chainId = useChainId()
  // 打开上架模态框
  const showListingModal = () => {
    setIsModalVisible(true);
  };

  // 监听签名验证成功事件
  useWatchContractEvent({
    address: CONTRACT_ADDRESS, // 合约地址
    abi: configAbi.abi, // 合约ABI
    eventName: "NFTListed",
    chainId,
    onLogs: (logs) => {
      console.log("NFTListed Event =>", logs)
      
    },
    onError: (error) => {
      console.error("NFTListed Event Error =>", error)
    },
  })

  // 处理上架操作
  const handleListing = async () => {
    if (!price || parseFloat(price) <= 0) {
      message.error("请输入有效的价格");
      return;
    }

    try {
      await approve(BigInt(tokenId));
      // 将ETH转换为wei
      const priceInWei = parseEther(price);

      const order = {
        contract_: CONTRACT_ADDRESS, // 使用合约地址作为contract_参数的值,
        tokenIds: [BigInt(tokenId)],
        price: priceInWei, // 使用转换后的wei值
        expiry: BigInt(Math.floor(Date.now() / 1000) + 60 * 60), // 1小时后过期，使用秒为单位
      };

      const encodedData = encodeAbiParameters(
        ORDER_PARAMS,
        [
          order.contract_,
          order.tokenIds,
          order.price,
          order.expiry
        ]
      );
      const messageHash = keccak256(encodedData);
      console.log("order", messageHash)
      // sign
      signMessage({
        message: { raw: messageHash }
      }, {
        onSuccess(data) {
          console.log("signMessage success", data)
          // verify
          writeContract({
            address: CONTRACT_ADDRESS,
            abi: configAbi.abi,
            functionName: "listNFT",
            args: [order.contract_, order.tokenIds, order.price, order.expiry, data],
            gas: BigInt(1000000),
          }, {
            onSuccess: (data) => {
              console.log("listNFT success", data)
            },
            onError: (error) => {
              console.error("Contract call failed:", error);
            }
          })
        },
      });
    } catch (error) {
      console.error("上架NFT时出错:", error);
      window.$message.error("上架失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button type="link" color="cyan" onClick={showListingModal}>
        上架NFT
      </Button>

      <Modal
        title={`上架NFT ${name}`}
        open={isModalVisible}
        onOk={handleListing}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={isLoading}
      >
        <p>请输入您希望出售此NFT的价格（ETH）：</p>
        <Input
          type="number"
          placeholder="例如：0.1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
        />
      </Modal>
    </>
  );
};

export default memo(SelfNFT);
