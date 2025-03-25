import React, { memo, useEffect, useState } from "react";
import { Button, Input, message, Modal } from "antd";

import {
  parseEther,
  formatEther,
} from "viem";
import configAbi from "@/abi/mahjongNFT";
import { useContractFunctions, useWriteContractGetLogs } from "@/hooks/useContractWrite";
import { useFetchGraphQL } from "@/lib/api";
import useStore from "@/store";

interface SelfNFTProps {
  name: string;
  tokenId: string;
  nftId: string;
}

const ORDER_PARAMS = [
  { name: "contract_", type: "address" },
  { name: "tokenIds", type: "uint256[]" },
  { name: "price", type: "uint256" },
  { name: "expiry", type: "uint256" },
];
const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const SelfNFT: React.FC<SelfNFTProps> = ({ name, tokenId, nftId }) => {
  const { approve, signMessageOfAccount, callListNFT } = useContractFunctions();
  const { createListingFetch } = useFetchGraphQL();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { refetchList } = useStore();

  const [listNFTHash, setListNFTHash] = useState<`0x${string}`>();
  const { logs } = useWriteContractGetLogs(listNFTHash, configAbi.abi, "NFTListed");
  useEffect(() => {
    if (logs.length === 0) return;
    const {
      args: { seller, price },
    } = logs[0];
    if (seller && price) {
      addListing(price, seller);
      refetchList && refetchList();
    }
  }, [logs]);


  // add listing
  const addListing = async (price: bigint, seller: `0x${string}`) => {
    const result = await createListingFetch({
      nftId,
      price: Number(formatEther(price)),
      seller: seller.toString(),
    });
    if (result) {
      window.$message.success("上架成功");
      setIsModalVisible(false);
    }
  };

  // 打开上架模态框
  const showListingModal = () => {
    setIsModalVisible(true);
  };

  const handleListing = async () => {
    if (!price || parseFloat(price) <= 0) {
      message.error("请输入有效的价格");
      return;
    }

    try {
      // 将ETH转换为wei
      const priceInWei = parseEther(price);
      // 1. 授权合约拥有NFT权限
      await approve(BigInt(tokenId));
      // 2. 私钥签名
      const { data: signature, order } = await signMessageOfAccount(BigInt(tokenId), priceInWei);
      // 3. 上架NFT
      const hash = await callListNFT(order, signature);
      setListNFTHash(hash)
    } catch (error) {
      console.error("上架NFT时出错:", error);
      window.$message.error("上架失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" color="cyan" onClick={showListingModal}>
        上架NFT
      </Button>

      <Modal
        title={`上架NFT ${name}`}
        open={isModalVisible}
        onOk={handleListing}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={isLoading}
        destroyOnClose
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
