import { AddResult, create, } from 'kubo-rpc-client';
import { NFTItemProps } from '@/types';
// 连接到本地 IPFS 节点的 API 端口（默认 5001）
const ipfs = create({
  url: process.env.NEXT_PUBLIC_IPFS_API_URL || '',
});

// 可选：测试连接是否成功
export async function testConnection() {
  const version = await ipfs.version();
  console.log('IPFS 节点版本:', version);
}

/**
 * 上传文件
 * @param fileBlob 
 * @param fileName 
 * @returns 
 */
export async function uploadFile(fileBlob: BlobPart[], fileName: string): Promise<AddResult> {
  const file = new File(fileBlob, fileName);
  const result = await ipfs.add(file);
  return result;
}

/**
 * 上传NFT元数据
 * @param config <NFTItemProps>
 * @returns 
 */
export async function uploadMetadata(config: NFTItemProps): Promise<AddResult> {
  const metadataBuffer = Buffer.from(JSON.stringify(config));
  const result = await ipfs.add(metadataBuffer);
  return result;
}