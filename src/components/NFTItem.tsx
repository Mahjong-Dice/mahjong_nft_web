import { memo, useState } from "react";
import { I_NFT } from "@/types";
import { Button, Modal, Descriptions, Tooltip, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
// import Image from 'next/image';

export interface NFTItemProps {
  image: string;
  name: string;
  description: string;
  attributes?: { trait_type: string; value: string }[];
}

function NFTItem({ nft }: { nft: I_NFT }) {
  const { image, name, description } = nft.metadata;
  return (
    <div className="group cursor-pointer relative overflow-hidden rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-lg relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover scale-80 transition-transform duration-300 group-hover:scale-100"
        />
      </div>
      <div className="mt-3 space-y-2">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-sm text-gray-400">简介 {description}</p>
        <div className="flex items-center justify-between">
          {/* <span className="text-base font-medium text-green-400">{price} ETH</span> */}

          <NFTDetailsModal nft={nft} />
        </div>
      </div>
    </div>
  );
}

const NFTDetailsModal = memo(
  ({ nft }: { nft: I_NFT }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { owner, contractAddress, tokenId, creator } = nft;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const copyToClipboard = (text: string, label: string) => {
      navigator.clipboard.writeText(text).then(
        () => {
          messageApi.success(`已复制${label}`);
        },
        () => {
          messageApi.error("复制失败");
        }
      );
    };

    const renderCopyableItem = (value: string, label: string) => (
      <div className="flex items-center group relative">
        <span className="break-all">{value}</span>
        <Tooltip title="点击复制">
          <CopyOutlined
            className="cursor-pointer text-blue-500 hover:text-blue-700 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => copyToClipboard(value, label)}
          />
        </Tooltip>
      </div>
    );

    return (
      <>
        {contextHolder}
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          查看详情
        </Button>

        <Modal
          width={800}
          title={`${nft.metadata?.name || "NFT"} 详情`}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              关闭
            </Button>,
          ]}
        >
          <Descriptions column={1} bordered>
            {owner && (
              <Descriptions.Item label="拥有者">
                {renderCopyableItem(owner, "拥有者地址")}
              </Descriptions.Item>
            )}
            {contractAddress && (
              <Descriptions.Item label="合约地址">
                {renderCopyableItem(contractAddress, "合约地址")}
              </Descriptions.Item>
            )}
            {tokenId && (
              <Descriptions.Item label="代币ID">
                {renderCopyableItem(tokenId.toString(), "代币ID")}
              </Descriptions.Item>
            )}
            {creator && (
              <Descriptions.Item label="创建者">
                {renderCopyableItem(creator, "创建者地址")}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Modal>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.nft.owner === nextProps.nft.owner &&
      prevProps.nft.contractAddress === nextProps.nft.contractAddress &&
      prevProps.nft.tokenId === nextProps.nft.tokenId &&
      prevProps.nft.creator === nextProps.nft.creator &&
      prevProps.nft.metadata?.name === nextProps.nft.metadata?.name
    );
  }
);

NFTDetailsModal.displayName = "NFTDetailsModal";

NFTItem.displayName = "NFTItem";

export default memo(NFTItem);
