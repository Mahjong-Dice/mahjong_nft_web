import {
  IListing,
  IListingCreateRequest,
  ITransactionCreateRequest,
} from "@/styles/grahpQL";
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

export const DEACTIVATE_LISTING = gql`
  mutation DeactivateListing($id: ID!) {
    deactivateListing(id: $id) {
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
export const EXECUTE_TRANSACTION = gql`
  mutation ExecuteTransaction($input: TransactionInput!) {
    listings(input: $input) {
      id
      nftId
      fromAddress
      toAddress
      price
      timestamp
    }
  }
`;

export function useFetchGraphQL() {
  const [_createListing] = useMutation(CREATE_LISTING);
  const [_deactivateListing] = useMutation(DEACTIVATE_LISTING);
  const [_executeTransaction] = useMutation(EXECUTE_TRANSACTION);

  /** 上架
   *
   * @param input
   * @returns
   */
  function createListingFetch(input: IListingCreateRequest) {
    return _createListing({
      variables: {
        input,
      },
    });
  }
  /** 下架
   *
   * @param id listing id
   * @returns
   */
  function removeListingFetch(id: string) {
    return _deactivateListing({
      variables: {
        id,
      },
    });
  }
  /** 执行交易
   *
   */
  function executeTransaction(input: ITransactionCreateRequest) {
    return _executeTransaction({
      variables: {
        input,
      },
    });
  }

  return {
    createListingFetch,
    removeListingFetch,
    executeTransaction
  };
}
