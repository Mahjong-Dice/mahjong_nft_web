import { Button } from "antd";
import { memo } from "react";
import { useFetchGraphQL } from "@/lib/api";
import { useContractFunctions } from "@/hooks/useContractWrite";
import { useAccount } from "wagmi";
import { ITransactionCreateRequest } from "@/styles/grahpQL";

type BuyNFTListingProps = Omit<ITransactionCreateRequest, "toAddress">;

function BuyNFTListing({
  nftId: tokenId,
  price,
  fromAddress,
}: BuyNFTListingProps) {
  const { address: toAddress } = useAccount();
  const { buyNFT } = useContractFunctions();
  const { executeTransaction } = useFetchGraphQL();

  const handleBuy = async () => {
    try {
      console.log("buy", tokenId, toAddress, price);
      if (!toAddress) return;
      await buyNFT(+tokenId, price);
      const result = executeTransaction({
        toAddress,
        fromAddress: toAddress,
        nftId: tokenId.toString(),
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
