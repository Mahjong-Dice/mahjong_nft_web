import { Button } from "antd";
import { memo } from "react";
import { useContractFunctions } from "@/hooks/useContractWrite";
import { useFetchGraphQL } from "@/lib/api";

interface IProps {
  listingId: string;
  tokenId: string;
}

function DeactivatedListing({ listingId, tokenId }: IProps) {
  const { cancelListNFT } = useContractFunctions();
  const { removeListingFetch } = useFetchGraphQL();

  const handleClick = async () => {
    try {
      await cancelListNFT(tokenId);
      await removeListingFetch(listingId);
      window.$message.success("下架成功");
    } catch (error) {
      window.$message.error("下架失败");
    }
  };

  return (
    <Button type="primary" danger onClick={handleClick}>
      下架
    </Button>
  );
}

export default memo(DeactivatedListing);
