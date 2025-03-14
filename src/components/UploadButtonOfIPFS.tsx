'use client'
import { useWriteContract, useChainId, useSimulateContract } from 'wagmi'
import mahjongNFTAbi from '@/abi/mahjongNFT'
import { parseEther } from 'viem';
import { useEffect, useState, memo } from 'react';
import CreateNFTForm from '@/components/CreateNFTForm';

interface UploadButtonOfIPFSProps {
    onSuccess: (uri: string) => void
}


function UploadButtonOfIPFS() {
    const chainId = useChainId()
    const { writeContract, } = useWriteContract()
    const [ipfsPath, setIpfsPath] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: simulateData } = useSimulateContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: mahjongNFTAbi.abi,
        chainId,
        functionName: "mint",
        args: [ipfsPath],
        value: parseEther('0.001'),
        enabled: !!ipfsPath, // 只有当 ipfsPath 存在时才执行
    })

    // 上传成功后调用, 铸造NFT  
    const handleUploadIPFSSuccess = (path: string) => {
        setIpfsPath(path)
        if (simulateData?.request) {
            simulateData.request.args = [path];
            writeContract(simulateData.request, {
                onSuccess: (data) => {
                    console.log("mint success", data)
                    setIpfsPath('') // 重置 ipfsPath
                },
                onError: (err) => {
                    console.log("mint error", err)
                    setIpfsPath('') // 重置 ipfsPath
                }
            })
        }
    }

    return <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => setIsModalOpen(true)}>
            Mint NFT
        </button>
        <CreateNFTForm open={isModalOpen}
            onClose={() => setIsModalOpen(false)} onSuccess={handleUploadIPFSSuccess} />
    </div>
}

export default UploadButtonOfIPFS;