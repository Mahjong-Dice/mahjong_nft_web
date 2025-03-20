import React, { memo, useEffect, useState } from "react";
import { Button, Input, message, Modal } from "antd";

import {
  useWriteContract,
  useSignMessage,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  encodeAbiParameters,
  keccak256,
  parseEther,
  formatEther,
} from "viem";
import configAbi from "@/abi/mahjongNFT";
import { config } from "@/wagmi";
import { useApprove, useWriteContractGetLogs } from "@/hooks/useContractWrite";
import { useFetchGraphQL } from "@/lib/api";

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
  const { approve } = useApprove();
  const { createListing } = useFetchGraphQL();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync, data } = useWriteContract({
    config,
  });
  const { logs } = useWriteContractGetLogs(data, configAbi.abi, "NFTListed");
  useEffect(() => {
    if(logs.length === 0) return;
    const {
      args: { seller, price },
    } = logs[0];
    if (seller && price) {
      addListing(price, seller);
    }
  }, [logs]);

  const { signMessage } = useSignMessage();

  const addListing = async (price: bigint, seller: `0x${string}`) => {
    const result = await createListing({
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
      await approve(BigInt(tokenId));
      // 将ETH转换为wei
      const priceInWei = parseEther(price);

      const order = {
        contract_: CONTRACT_ADDRESS, // 使用合约地址作为contract_参数的值,
        tokenIds: [BigInt(tokenId)],
        price: priceInWei, // 使用转换后的wei值
        expiry: BigInt(Math.floor(Date.now() / 1000) + 60 * 60), // 1小时后过期，使用秒为单位
      };

      const encodedData = encodeAbiParameters(ORDER_PARAMS, [
        order.contract_,
        order.tokenIds,
        order.price,
        order.expiry,
      ]);
      const messageHash = keccak256(encodedData);
      console.log("order", messageHash);
      // sign
      signMessage(
        {
          message: { raw: messageHash },
        },
        {
          async onSuccess(data) {
            console.log("signMessage success", data);
            // verify
            await writeContractAsync({
              address: CONTRACT_ADDRESS,
              abi: configAbi.abi,
              functionName: "listNFT",
              args: [
                order.contract_,
                order.tokenIds,
                order.price,
                order.expiry,
                data,
              ],
              gas: BigInt(1000000),
            });
          },
        }
      );
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
