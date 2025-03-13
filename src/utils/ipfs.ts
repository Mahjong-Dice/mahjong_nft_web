import { create } from 'kubo-rpc-client';
// 连接到本地 IPFS 节点的 API 端口（默认 5001）
const ipfs = create({
  url: process.env.NEXT_PUBLIC_IPFS_API_URL || '',
});

// 可选：测试连接是否成功
export async function testConnection() {
  const version = await ipfs.version();
  console.log('IPFS 节点版本:', version);
}

export async function uploadFile(fileBlob: Blob[], fileName: string) {
  const file = new File(fileBlob, fileName);
  const result = await ipfs.add(file);
  console.log('文件上传结果:', result);
}