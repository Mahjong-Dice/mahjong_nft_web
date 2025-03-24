import { Button } from "antd";
import { memo } from "react";
import {} from "@/lib/api";
import { useContractFunctions } from "@/hooks/useContractWrite";
import { Address } from "viem";
import { useAccount } from "wagmi";

function BuyNFTListing({ tokenId }: { tokenId: number }) {
  const { address: toAddress } = useAccount();
  const { buyNFT } = useContractFunctions();

  const handleBuy = () => {
    console.log("buy", tokenId, toAddress);
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
