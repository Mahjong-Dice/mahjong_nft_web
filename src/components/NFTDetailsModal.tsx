import { I_NFT } from "@/types";
import { CopyOutlined } from "@ant-design/icons";
import { Button, Descriptions, message, Modal, Tooltip } from "antd";
import { memo, useState } from "react";

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
          <Descriptions
            column={1}
            bordered
            labelStyle={{ width: "120px" }}
            contentStyle={{ maxWidth: "600px" }}
          >
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
            {nft.metadata?.name && (
              <Descriptions.Item label="名称">
                {renderCopyableItem(nft.metadata.name, "名称")}
              </Descriptions.Item>
            )}
            {nft.metadata?.description && (
              <Descriptions.Item label="描述">
                <Tooltip title={nft.metadata.description}>
                  {renderCopyableItem(nft.metadata.description, "描述")}
                </Tooltip>
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

export default NFTDetailsModal;
