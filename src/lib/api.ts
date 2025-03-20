import { IListing, IListingCreateRequest } from "@/styles/grahpQL";
import { gql, useMutation, useQuery } from "@apollo/client";

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
      listing {
            id
            nftId
            price
            seller
            isActive
            createdAt
            updatedAt
      }
    }
  }
`;

export const CREATE_LISTING = gql`
  mutation CreateListing($input: ListingCreateInput!) {
    createListing(input: $input) {
      id
      nftId
      price
      seller
      isActive
      createdAt
      updatedAt
    }
  }
`;

export function useFetchGraphQL() {
  const [_createListing] = useMutation(CREATE_LISTING);

  function createListing(input: IListingCreateRequest) {
    return _createListing({
      variables: {
        input,
      },
    });
  }
  return {
    createListing,
  };
}
