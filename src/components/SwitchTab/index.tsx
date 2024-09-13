import React, { FC, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter,Router } from "next/router"; // 用于页面跳转
import { useTranslation } from "react-i18next";
interface SwitchTabProps {
  type?: "home" | "normal";
}

const SwitchTab: FC<SwitchTabProps> = ({ type = "normal" }) => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("market");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 控制菜单的状态
  const menuRef = useRef<HTMLDivElement>(null); // 用于点击外部关闭菜单的引用
  const router = useRouter(); // 用于跳转
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // router.push('/discover')
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  useEffect(() => {
    setActiveTab(localStorage.getItem("currentMenuTab"));
  },[activeTab])
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const goMasrket = (str:string) =>{
    localStorage.setItem("currentMenuTab", str);
    setActiveTab(str);
    if(str == 'market'){
      router.push('/discover')
    }
  }
  return (
    <nav
      className={`flex rounded-[6px] text-tab text-400 flex items-center ${
        type === "normal"
          ? "w-[220px] bg-inactiveTab border border-solid border-tabBorder"
          : ""
      }`}
    >
      <div
        onClick={() => goMasrket("market")}
        className={`whitespace-nowrap py-3 w-full rounded-[6px] cursor-pointer text-center ${
          activeTab === "market" ? "bg-activeTab text-primary" : "text-white"
        }`}
      >
        {t('market')}
      </div>

      <div
        onClick={() => {
          goMasrket("pointMarkets");
          toggleMenu()
        }}
        className={`whitespace-nowrap w-full py-3 rounded-[6px] cursor-pointer text-center ${
          activeTab === "pointMarkets"
            ? "bg-activeTab text-primary"
            : "text-activeTab"
        }`}
      >
        {t('points')}
      </div>

      {/* 点击图标触发菜单 */}
      {isMenuOpen && (
        <div className="relative mt-[28px]" ref={menuRef}>
          <div className="absolute top-full right-0 mt-2 bg-thirdary text-primary text-desc rounded-lg shadow-lg z-10 w-[200px]">
            <ul className="text-sm">
            <li
                className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-tl-xl rounded-tr-xl"
                onClick={() => {
                  router.push("/market");
                  setIsMenuOpen(false);
                }}
              >
                <Image
                  src="/referral.svg"
                  alt="Referral"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                {t('market')}
              </li>
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  router.push("/referral");
                  setIsMenuOpen(false);
                }}
              >
                <Image
                  src="/referral.svg"
                  alt="Referral"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                {t('referral')}
              </li>
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  router.push("/reward");
                  setIsMenuOpen(false);
                }}
              >
                <Image
                  src="/reward.svg"
                  alt="Reward Center"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                {t('reward-center')}
              </li>
              <li
                className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-bl-xl rounded-br-xl"
                onClick={() => {
                  router.push("/points");
                  setIsMenuOpen(false);
                }}
              >
                <Image
                  src="/points.svg"
                  alt="My Points"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                 {t('my-points')}
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SwitchTab;
