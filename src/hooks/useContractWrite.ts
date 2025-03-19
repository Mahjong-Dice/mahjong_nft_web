import { useWriteContract } from 'wagmi';
import { message } from 'antd';
import mahjongNFTAbi from '@/abi/mahjongNFT';

interface ContractWriteParams {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args?: any[];
  value?: bigint;
}

export const useContractWrite = () => {
  const { writeContract } = useWriteContract();

  const writeContractWithPromise = (params: ContractWriteParams) => {
    return new Promise((resolve, reject) => {
      writeContract(
        // @ts-ignore
        {
          ...params,
        },
        {
          onSuccess: (data) => {
            console.log(`${params.functionName} success:`, data);
            resolve(data);
          },
          onError: (error) => {
            console.error(`${params.functionName} error:`, error);
            reject(error);
          },
        }
      );
    });
  };

  return { writeContractWithPromise };
};

/**
 * 授权NFT给合约
 * @returns approve 授权
 */
export const useApprove = () => {
  const { writeContractWithPromise } = useContractWrite();

  const approve = async (tokenId: number | bigint) => {
    return writeContractWithPromise({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: mahjongNFTAbi.abi,
      functionName: "approve",
      args: [process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, tokenId],
    })
  }
  return {
    approve
  }
}