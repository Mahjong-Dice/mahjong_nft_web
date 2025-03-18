export interface NFTItemProps {
  image: string;
  name: string;
  description: string;
  attributes?: { trait_type: string; value: string }[];
}

export interface I_NFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  metadata: NFTItemProps;
  owner: string;
  creator: string;
}
