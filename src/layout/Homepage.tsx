"use client";
import React, { useEffect } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const router = useRouter();

  const connectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  // 监听钱包连接状态
  useEffect(() => {
    if (isConnected) {
      // 钱包连接成功后跳转到home路径
      router.push("/home");
    }
  }, [isConnected, router]);

  return (
    <div className="home-container">
      {/* 左侧内容区域 */}
      <div className="left-section">
        <div className="left-content">
          <h1 className="main-title">麻将 NFT 收藏</h1>
          <h3 className="sub-title">
            探索独特的麻将数字藏品，连接您的钱包开始收藏之旅
          </h3>
          <p className="description">
            我们的平台提供独特的麻将主题NFT，每一个都代表着传统文化与现代艺术的完美结合。
            通过区块链技术，确保每件藏品的真实性和稀有性。
          </p>
        </div>
      </div>

      {/* 右侧登录区域 */}
      <div className="right-section">
        <div className="login-container">
          <h2 className="login-title">连接钱包</h2>
          <p className="login-description">
            请连接您的Web3钱包以访问我们的NFT平台，浏览和收藏独特的麻将数字藏品。
          </p>

          <button className="connect-button" onClick={connectWallet}>
            <span className="wallet-icon">💼</span>
            连接钱包
          </button>

          <p className="wallet-support-text">
            我们支持多种钱包，包括MetaMask、WalletConnect、Coinbase等
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
