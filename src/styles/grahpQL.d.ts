// NFT 相关接口定义

// NFT 基础接口
export interface INFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  metadata: Record<string, any>; // JSON 类型
  owner: string;
  creator: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// NFT 创建请求接口
export interface INFTCreateRequest {
  tokenId: string;
  contractAddress: string;
  metadata: Record<string, any>;
  owner: string;
  creator: string;
}

// NFT 响应接口
export interface INFTResponse extends INFT {
  listing?: IListing;
  transactions?: ITransaction[];
}

// Listing 接口
export interface IListing {
  id?: string;
  nftId: string;
  price: number;
  seller: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Listing 创建请求接口
export interface IListingCreateRequest {
  nftId: string;
  price: number;
  seller: string;
  isActive?: boolean;
}

// Transaction 接口
export interface ITransaction {
  id?: string;
  nftId: string;
  fromAddress: string;
  toAddress: string;
  price: number;
  timestamp?: Date;
}

// Transaction 创建请求接口
export interface ITransactionCreateRequest {
  nftId: string;
  fromAddress: string;
  toAddress: string;
  price: number;
}

// API 响应接口
export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}