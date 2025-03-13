'use client'
import { ConnectButton, WalletButton } from '@rainbow-me/rainbowkit'
// import { Wallet } from 'lucide-react' // 添加钱包图标
import { FaDice } from "react-icons/fa";

export default function home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-blue-800">
            <header className="p-4 flex justify-between">
                <div className='text-white flex gap-4 items-center'>
                    <FaDice className='md:text-3xl text-2xl animate-spin'/>
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
            <main className="container mx-auto p-4">
                {/* 这里可以添加您的主要内容 */}
            </main>
        </div>
    )
}