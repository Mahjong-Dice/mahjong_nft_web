import {
  useSignMessage,
  useWaitForTransactionReceipt,
  useWriteContract,
  useConfig,
  useSimulateContract,
} from "wagmi";
import mahjongNFTAbi from "@/abi/mahjongNFT";
import { useEffect, useState } from "react";
import {
  parseEventLogs,
  Abi,
  encodeAbiParameters,
  keccak256,
  parseEther,
  formatEther,
} from "viem";

interface ContractWriteParams<TAbi extends Abi = Abi> {
  address: `0x${string}`;
  abi: TAbi;
  functionName: Extract<TAbi[number], { type: "function" }>["name"];
  args?: any[];
  value?: bigint;
  [key: string]: any;
}

interface Order {
  contract_: `0x${string}`;
  tokenIds: bigint[];
  price: bigint;
  expiry: bigint;
}

type Address = `0x${string}`;

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const ORDER_PARAMS = [
  { name: "contract_", type: "address" },
  { name: "tokenIds", type: "uint256[]" },
  { name: "price", type: "uint256" },
  { name: "expiry", type: "uint256" },
];

export const useContractWrite = () => {
  const { writeContract } = useWriteContract();
  const [paramsOfSimulate, setParamsOfSimulate] = useState(null);

  // const { data: simulateData, refetch, error } = useSimulateContract(paramsOfSimulate || undefined);

  // useEffect(() => {
  //   console.log("error", error);
  // }, [error]);

  // useEffect(() => {
  //   console.log("simulateData", simulateData);
  // }, [simulateData]);

  // useEffect(() => {
  //   console.log("paramsOfSimulate", paramsOfSimulate);
  //   // 当参数变化时，手动触发重新获取模拟数据
  //   if (paramsOfSimulate) {
  //     refetch();
  //   }
  // }, [paramsOfSimulate, refetch]);

  const writeContractWithPromise = <TAbi extends Abi = Abi>(
    params: ContractWriteParams<TAbi>
  ) => {
    console.log("params:", params);
    // setParamsOfSimulate({
    //   ...params,
    // });

    return new Promise<Address>((resolve, reject) => {
      writeContract(
        // @ts-ignore
        params,
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
 * 通过 transaction hash 获取合约事件日志
 * @param hash
 * @param abi
 * @param event
 * @returns
 */
export const useWriteContractGetLogs = <
  TAbi extends Abi,
  TEventName extends string = string,
  TArgs = any
>(
  hash: `0x${string}` | undefined,
  abi: TAbi,
  event: TEventName
) => {
  const { data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  type EventLog = {
    eventName: string;
    args: TArgs;
    [key: string]: any;
  };

  const [logs, setLogs] = useState<EventLog[]>([]);

  useEffect(() => {
    if (receipt) {
      const events = parseEventLogs({
        abi,
        logs: receipt?.logs,
      });

      const filteredEvents = events.filter(
        (e) => e.eventName === (event as string)
      ) as EventLog[];

      setLogs(filteredEvents);
    }
  }, [receipt, abi, event]);

  return {
    logs,
  };
};

export const useContractFunctions = () => {
  const { writeContractWithPromise } = useContractWrite();
  const { signMessage } = useSignMessage();

  /** 授权
   *
   * @param tokenId
   * @returns
   */
  const approve = async (tokenId: number | bigint) => {
    return writeContractWithPromise({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: mahjongNFTAbi.abi,
      functionName: "approve",
      args: [process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, tokenId],
    });
  };

  /** 移除授权
   *
   * @param tokenId
   * @returns
   */
  const revokeApproval = (tokenId: number | bigint) => {
    return writeContractWithPromise({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: mahjongNFTAbi.abi,
      functionName: "revokeApproval",
      args: [tokenId],
    });
  };

  /** 生成消息密钥签名
   * 
   * @param tokenId  
   * @param price 
   * @returns {
      data: `0x${string}`,
      order: {
        contract_: `0x${string}`,
        tokenIds: bigint[],
        price: bigint,
        expiry: bigint,
      }
    }
   */
  const signMessageOfAccount = (tokenId: bigint, price: bigint) => {
    return new Promise<{
      data: `0x${string}`;
      order: Order;
    }>((resolve, reject) => {
      try {
        const order = {
          contract_: CONTRACT_ADDRESS, // 使用合约地址作为contract_参数的值,
          tokenIds: [BigInt(tokenId)],
          price: price, // 使用转换后的wei值
          expiry: BigInt(Math.floor(Date.now() / 1000) + 60 * 60), // 1小时后过期，使用秒为单位
        };

        const encodedData = encodeAbiParameters(ORDER_PARAMS, [
          order.contract_,
          order.tokenIds,
          order.price,
          order.expiry,
        ]);
        const messageHash = keccak256(encodedData);

        signMessage(
          {
            message: {
              raw: messageHash,
            },
          },
          {
            onSuccess(data) {
              resolve({
                data,
                order,
              });
            },
            onError(error) {
              reject(error.message);
            },
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };
  // 上架
  const callListNFT = (
    order: Order,
    signature: `0x${string}`
  ): Promise<`0x${string}`> => {
    return writeContractWithPromise({
      address: CONTRACT_ADDRESS,
      abi: mahjongNFTAbi.abi,
      functionName: "listNFT",
      args: [
        order.contract_,
        order.tokenIds,
        order.price,
        order.expiry,
        signature,
      ],
      gas: BigInt(1000000),
    });
  };
  // 下架
  const cancelListNFT = (listingId: string) => {
    return writeContractWithPromise({
      address: CONTRACT_ADDRESS,
      abi: mahjongNFTAbi.abi,
      functionName: "revokeApproval",
      args: [listingId],
    });
  };

  /** 购买
   *
   * @param to 购买者地址
   * @param tokenId
   * @returns
   */
  const buyNFT = async (tokenId: number, price: number) => {
    return writeContractWithPromise({
      address: CONTRACT_ADDRESS,
      abi: mahjongNFTAbi.abi,
      functionName: "buyNFT",
      args: [tokenId],
      value: parseEther(price.toString()),
    });
  };

  return {
    approve,
    revokeApproval,
    signMessageOfAccount,
    callListNFT,
    cancelListNFT,
    buyNFT,
  };
};
