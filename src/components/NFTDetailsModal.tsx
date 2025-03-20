import { INFTResponse } from "@/styles/grahpQL";
import { CopyOutlined } from "@ant-design/icons";
import { Button, Descriptions, message, Modal, Tooltip } from "antd";
import { memo, useState } from "react";

const NFTDetailsModal = memo(
  ({ nft }: { nft: INFTResponse }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { owner, contractAddress, tokenId, creator } = nft;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = () => {
      setIsModalOpen(false);
    };



    return (
      <>
        {contextHolder}
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          查看详情
        </Button>

        <Modal
          width={700}
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
          >
            {DescriptionsItem("拥有者", contractAddress, "拥有者地址")}
            {DescriptionsItem("价格", nft.listing?.price?.toString() + "eth", "价格")}
            {DescriptionsItem("创建者", creator, "创建者地址")}
            {DescriptionsItem("名称", nft.metadata.name)}
            {DescriptionsItem("合约地址", nft.contractAddress)}
            {DescriptionsItem("代币ID", tokenId.toString())}
            {DescriptionsItem("描述", nft.metadata.description)}
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

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      window.$message.success(`已复制${label}`);
    },
    () => {
      window.$message.error("复制失败");
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

function DescriptionsItem(label: string, value?: string, title?: string) {
  if (!label || !value) {
    return null;
  }
  return <Descriptions.Item label={label}>
    {/* <Tooltip title={title}> */}
    {renderCopyableItem(value, title ?? label)}
    {/* </Tooltip> */}
  </Descriptions.Item>
}


NFTDetailsModal.displayName = "NFTDetailsModal";


export default NFTDetailsModal;
