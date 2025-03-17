import { gql } from '@apollo/client';


export const CREATE_NFT = gql`
  mutation CreateNFT($input: NFTCreateInput!) {
    createNFT(input: $input) {
      id
      tokenId
      contractAddress
      metadata
      owner
      creator
    }
  }
`;


export const GET_NFTS = gql`
    query GetNFTs($filter: NFTFilterInput) {
        nfts(filter: $filter) {
            id
            tokenId
            contractAddress
            metadata
            owner
            creator
        }
    }
`;
