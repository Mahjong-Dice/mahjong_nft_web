/**
 * 使用钱包私钥对消息进行签名的工具函数
 * 基于viem库实现
 * @module signature
 */
import { Account, WalletClient } from 'viem';
import { signMessage } from 'viem/actions';

/**
 * 使用钱包对消息进行签名
 * @param {import('viem').WalletClient} walletClient - viem钱包客户端
 * @param {string} message - 需要签名的消息
 * @param {string} address - 签名者的地址
 * @returns {Promise<string>} - 返回消息的签名
 */
export async function signMessageWithWallet(walletClient: WalletClient, message: string, address: Account): Promise<string> {
  if (!walletClient || !message || !address) {
    throw new Error('钱包客户端、消息和地址都不能为空');
  }
  
  try {
    // 使用viem的signMessage方法对消息进行签名
    const signature = await signMessage(walletClient, {
      account: address,
      message: message
    });
    
    return signature;
  } catch (error) {
    console.error('消息签名失败:', error);
    throw new Error(`签名失败: ${error?.message}`);
  }
}

/**
 * 生成要签名的标准消息格式
 * @param {Object} data - 需要包含在签名中的数据
 * @param {number} [expiresIn=3600] - 签名有效期（秒）
 * @returns {string} - 格式化的消息字符串
 */
export function createSignatureMessage(data: object, expiresIn: number = 3600): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const expiresAt = timestamp + expiresIn;
  
  return JSON.stringify({
    data,
    timestamp,
    expiresAt
  });
}