//import { ConnectButton } from "@rainbow-me/rainbowkit";
import { config } from '../../providers/AppKitProvider'
import { useAccount, useDisconnect } from "wagmi";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { watchConnections, signMessage } from "@wagmi/core";
import { useWeb3Modal } from '@web3modal/wagmi/react'
//import { config } from "@/wagmi";
import {
  getAccount,
  disconnect
} from "@wagmi/core";
import { useRouter } from "next/router"; // 用于页面跳转
import { login, getSignContent } from '@/http/user'
import { toast } from 'react-toastify'
import useStore from '@/store/index';
import Router from 'next/router';
import { useTranslation } from "react-i18next";

var busy = false

function sign(message = '') {
  return signMessage(config, {
    message
  })
}

const WalletButton: React.FC = () => {
  const { t } = useTranslation("common");
  const { userInfo, updateUserInfo, isLogin, updateIsLogin } = useStore();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // 用于跳转
  const { open, close } = useWeb3Modal()

  function openConnectModal() {
    open({view: 'Connect'})
  }
  useEffect(() => {
    const unwatch = watchConnections(config, {
      async onChange(data) {
        console.log("Connections changed!", data);
        const isLogin = !!localStorage.getItem('token');
        if (isLogin && !data.length) {
          localStorage.removeItem('token')
          updateUserInfo('')
          updateIsLogin(false)
          return
        }
        if (!isLogin && data.length && !busy) {
          try {
            busy = true
            const content = await getSignContent()
            console.log('getSignContent', content)
            const signature = await sign(content.text)
            console.log('sign result', signature)
            const res = await login({
              walletAddr: getAccount(config).address,
              text: content.text,
              signature
            })
            console.log('login success', res)
            localStorage.setItem('token', res.token)
            updateUserInfo({ token: res.token, address: getAccount(config).address })
            updateIsLogin(true)
            // toast.success('login succeed')
          } catch (err) {
            console.log('login failed', err)
            toast.error(err.message)
            disconnect(config); // 断开连接
            localStorage.removeItem('token')
            updateUserInfo('')
            updateIsLogin(false)
          } finally {
            busy = false
          }
        }
      },
    });
  }, [])
  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // 监听点击事件
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleDisconnect = () => {
    disconnect(); // 断开连接
    setIsMenuOpen(false); // 关闭菜单
    localStorage.removeItem('token')
    updateUserInfo('')
    Router.push('/');
    updateIsLogin(false)
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // 切换菜单显示状态
  };

  // 复制地址后的操作
  const handleCopy = () => {
    toggleMenu();
    setIsCopied(true); // 设置已复制状态
    setTimeout(() => setIsCopied(false), 2000); // 2秒后重置已复制状态
  };
  const handlePort = () => {
    router.push('/portfolio')
  }
  return (
    <div className="relative flex items-center space-x-2">
      {isConnected ? (
        <div
          className="flex items-center space-x-2 bg-bannerBg text-thirdary px-4 py-2 rounded-full mr-[20px] cursor-pointer"
          ref={menuRef} // 将菜单容器引用赋给 menuRef
          onClick={toggleMenu} // 点击显示/隐藏菜单
        >
          <Image src="/user-icon.svg" alt="User" width={24} height={24} />
          <span className="truncate">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <Image
            src="/dropdown-arrow.svg"
            alt="Dropdown"
            width={16}
            height={16}
            className="cursor-pointer"
          />

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-thirdary text-primary rounded-lg shadow-lg z-10">
              <ul className="text-sm">
                <CopyToClipboard text={address || ""} onCopy={handleCopy}>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-tl-xl rounded-tr-xl">
                    <p className="flex items-center justify-center gap-2">
                      <Image
                        src="/user-icon.svg"
                        alt="User"
                        width={24}
                        height={24}
                      />
                      <span className="truncate">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                      {/* 修改图标颜色和背景 */}
                      <FaCopy
                        size={18}
                        className="text-black bg-white p-1 rounded-full"
                      />
                    </p>
                  </li>
                </CopyToClipboard>
                {isCopied && (
                  <li className="text-center text-green-500">地址已复制</li>
                )}
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handlePort()}
                >
                  My Portfolio
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-bl-xl rounded-br-xl"
                  onClick={handleDisconnect}
                >
                  {t("login-out")}
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        // <ConnectButton.Custom>
        //   {({ openConnectModal }) => (
        //     <div
        //       onClick={openConnectModal}
        //       className="bg-white text-black px-4 py-2 rounded-full mr-[20px]"
        //     >
        //       Connect Wallet
        //     </div>
        //   )}
        // </ConnectButton.Custom>
        <div
          onClick={openConnectModal}
          className="bg-white text-black px-4 py-2 rounded-full mr-[20px]"
        >
          Connect Wallet
        </div>
      )}
    </div>
  );
};

export default WalletButton;
