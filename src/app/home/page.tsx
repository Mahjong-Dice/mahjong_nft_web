'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
// import { Wallet } from 'lucide-react' // 添加钱包图标
import { FaDice } from "react-icons/fa";
import UploadButtonOfIPFS from '@/components/UploadButtonOfIPFS';
import NFTList from '@/components/NFTList';
import { useWriteContract, useChainId, useSimulateContract } from 'wagmi'
import mahjongNFTAbi from '@/abi/mahjongNFT'
import { parseEther } from 'viem';
import { useEffect, useState, memo } from 'react';

function home() {
    const chainId = useChainId()
    const { writeContract } = useWriteContract()
    const [ipfsPath, setIpfsPath] = useState<string>('')

    const { data: simulateData } = useSimulateContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: mahjongNFTAbi.abi,
        chainId,
        functionName: "mint",
        args: [ipfsPath],
        value: parseEther('0.001'),
        enabled: !!ipfsPath, // 只有当 ipfsPath 存在时才执行
    })

    useEffect(() => {
        if (simulateData?.request && ipfsPath) {
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
    }, [simulateData, ipfsPath, writeContract])

    const handleUploadIPFSSuccess = (path: string) => {
        console.log("path", path)
        setIpfsPath(path)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-blue-800 flex flex-col overflow-hidden w-screen h-screen">
            <header className="p-4 flex justify-between">
                <div className='text-white flex gap-4 items-center'>
                    <FaDice className='md:text-3xl text-2xl animate-spin' />
                    <span className='font-semibold text-xl md:text-2xl'>Mahjong World</span>
                </div>
                <div>
                    <div className='hidden sm:block'>
                        <ConnectButton accountStatus={{
                            smallScreen: 'avatar',
                            largeScreen: 'full',
                        }} />
                    </div>
                    <div className='sm:hidden'>
                        <ConnectButton chainStatus="name" accountStatus={{
                            smallScreen: 'avatar',
                            largeScreen: 'full',
                        }} />
                    </div>

                </div>
            </header>
            <main className="container mx-auto p-4 overflow-auto flex-1 custom-scrollbar">
                {/* 这里可以添加您的主要内容 */}
                <UploadButtonOfIPFS onSuccess={handleUploadIPFSSuccess} />
                <NFTList />
            </main>
        </div>
    )
}


export default memo(home)