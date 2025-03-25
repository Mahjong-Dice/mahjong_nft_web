import { memo } from "react";
import { I_NFT } from "@/types";
import SelfNFT from "./SelfNFT";
import NFTDetailsModal from "./NFTDetailsModal";
import { Image } from "antd";
import { INFTResponse } from "@/styles/grahpQL";
import { useAccount } from "wagmi";
import DeactivatedListing from "./DeactivatedListing";
import BuyNFTListing from "./BuyNFTListing";

function NFTItem({ nft }: { nft: INFTResponse }) {
  const { image, name, description } = nft.metadata;
  const { address } = useAccount();
  const isOwner = nft.owner === address;

  function showUtils() {
    if (nft.listing?.isActive) {
      if (isOwner && nft.listing.id) {
        return (
          <DeactivatedListing
            tokenId={nft.tokenId}
            listingId={nft.listing.id}
          />
        );
      } else {
        return (
          <BuyNFTListing
            tokenId={nft.tokenId}
            nftId={nft.id}
            fromAddress={nft.owner}
            price={nft.listing.price}
          />
        );
      }
    } else {
      if (isOwner) {
        return <SelfNFT name={name} tokenId={nft.tokenId} nftId={nft.id} />;
      }
    }
  }
  return (
    <div className="group cursor-pointer relative overflow-hidden rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-center aspect-square w-full max-h-60 max-w-[300px] mx-auto overflow-hidden rounded-lg relative ">
        <Image src={image} alt={name} height={"90%"} />
      </div>
      <div className="mt-3 space-y-2">
        <h3 className="text-lg font-semibold text-white text-truncate">
          {name}
        </h3>
        <div className="text-sm text-gray-400 w-full dark:text-white">
          <div className="w-full text-truncate">简介: {description}</div>
        </div>
        <div className="flex items-center justify-between">
          {nft.listing?.isActive && (
            <span className="text-base font-medium text-green-400">
              {nft.listing.price} ETH
            </span>
          )}

          <div className="flex items-center justify-between flex-1">
            <NFTDetailsModal nft={nft} />
            {showUtils()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(NFTItem);
