import { AddResult, create, } from 'kubo-rpc-client';
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
 * 上传 metasdata
 * @param name 名称
 * @param description  描述
 * @param imageUrl 
 * @param attributes 
 * @returns 
 */
export async function uploadMetadata(
  name: string,
  description: string,
  imageUrl: string,
  attributes?: Array<{ trait_type: string; value: string | number }>
): Promise<AddResult> {
  const metadata = {
    name,
    description,
    image: imageUrl, // IPFS URL of the image
    attributes: attributes || []
  };

  const metadataBuffer = Buffer.from(JSON.stringify(metadata));
  const result = await ipfs.add(metadataBuffer);
  return result;
}