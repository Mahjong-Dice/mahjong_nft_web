import { memo } from "react";
import { I_NFT } from "@/types";
import SelfNFT from "./SelfNFT";
import NFTDetailsModal from "./NFTDetailsModal";
import { Image } from "antd";
import { INFTResponse } from "@/styles/grahpQL";

export interface NFTItemProps {
  image: string;
  name: string;
  description: string;
  attributes?: { trait_type: string; value: string }[];
}

interface Types {
  isOwner?: boolean;
}

function NFTItem({ nft, isOwner }: { nft: INFTResponse } & Types) {
  const { image, name, description } = nft.metadata;
  return (
    <div className="group cursor-pointer relative overflow-hidden rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-lg relative">
        <Image
          src={image}
          alt={name}
          width={"100%"}
          height={"100%"}
          className="w-full h-full object-cover scale-80 transition-transform duration-300 group-hover:scale-100"
        />
      </div>
      <div className="mt-3 space-y-2">
        <h3 className="text-lg font-semibold text-white text-truncate">
          {name}
        </h3>
        <div className="text-sm text-gray-400 w-full dark:text-white">
          <div className="w-full text-truncate">
            简介: {description}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {
            nft.listing && (
              <span className="text-base font-medium text-green-400">{nft.listing.price} ETH</span>
            )
          }


          <div className="flex gap-4">
            <NFTDetailsModal nft={nft} />
            {
              !nft.listing?.isActive && <SelfNFT name={name} tokenId={nft.tokenId} nftId={nft.id} />
            }
            {
              isOwner && (
                <button>修改价格</button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(NFTItem);
