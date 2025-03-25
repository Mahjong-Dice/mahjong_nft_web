import { Button } from "antd";
import { memo } from "react";
import { useFetchGraphQL } from "@/lib/api";
import { useContractFunctions } from "@/hooks/useContractWrite";
import { useAccount } from "wagmi";
import { ITransactionCreateRequest } from "@/styles/grahpQL";

type BuyNFTListingProps = Omit<ITransactionCreateRequest, "toAddress"> & {
  tokenId: string;
};

function BuyNFTListing({
  nftId,
  price,
  tokenId,
  fromAddress,
}: BuyNFTListingProps) {
  const { address: toAddress } = useAccount();
  const { buyNFT } = useContractFunctions();
  const { executeTransaction } = useFetchGraphQL();

  const handleBuy = async () => {
    try {
      if (!toAddress) return;
      console.log("toAddress", nftId, price, tokenId, fromAddress);
      await buyNFT(+tokenId, price);
      const result = await executeTransaction({
        toAddress,
        fromAddress,
        nftId,
        price,
      });
      console.log("result", result);
    } catch (error) {
      window.$message.error("购买失败");
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleBuy}>
        购买
      </Button>
    </div>
  );
}

export default memo(BuyNFTListing);
