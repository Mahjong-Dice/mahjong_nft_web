import React, { useState } from "react";
import { Button, Input, message, Modal } from "antd";

import { useSignTypedData, useSendTransaction } from "wagmi";
import { parseEther } from "viem";

interface SelfNFTProps {
  name: string;
  tokenId: string;
}

const types = {
  Order: [
    { name: "contract", type: "address" }, // NFT合约地址
    { name: "tokenIds", type: "uint256[]" }, // Token ID数组
    { name: "price", type: "uint256" }, // 单价（wei单位）
    { name: "expiry", type: "uint256" }, // 有效时间戳
  ],
};

const SelfNFT: React.FC<SelfNFTProps> = ({ name, tokenId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signTypedData } = useSignTypedData();
  // 打开上架模态框
  const showListingModal = () => {
    setIsModalVisible(true);
  };

  // 处理上架操作
  const handleListing = async () => {
    if (!price || parseFloat(price) <= 0) {
      message.error("请输入有效的价格");
      return;
    }

    try {
      // 将ETH转换为wei
      const priceInWei = parseEther(price);
      
      signTypedData(
        {
          types,
          primaryType: "Order",
          message: {
            contract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
            tokenIds: [tokenId],
            price: priceInWei, // 使用转换后的wei值
            expiry: Math.floor(Date.now() / 1000) + 60 * 60, // 1小时后过期，使用秒为单位
          },
        },
        {
          onSuccess: (data) => {
            console.log("success")
            message.success("签名成功");
            console.log(data)
            // setIsModalVisible(false);
            // setPrice("");
          },
          onError: (error) => {
            console.log("error", error);
            message.error("签名失败，请重试");
          },
        }
      );
    } catch (error) {
      console.error("上架NFT时出错:", error);
      message.error("上架失败，请重试");
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

export default SelfNFT;
