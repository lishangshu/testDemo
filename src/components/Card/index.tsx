import Image from "next/image";
import React, { FC } from "react";
import Link from "next/link";
import { matchImg } from "@/commons/utils"
interface CardProps {
  abbrLogo: string;
  abbrSubLogo: string;
  abbrTitle: string;
  abbrApy: string|number;
  abbrVersion: string;
  abbrExpireTime:string
}

const Card: FC<CardProps> = ({ abbrLogo, abbrSubLogo, abbrTitle, abbrApy, abbrVersion,abbrExpireTime }) => {
  return (
    <div className="bg-white text-black p-4 rounded-lg shadow-lg border border-gray-300 w-400">
      <div className="flex items-center justify-between mb-4">
        {/* 左侧部分：Logo 和标题 */}
        <div className="flex items-center space-x-2">
          <div className="relative mr-2">
            <Image
              src={matchImg(abbrLogo)}
              alt={abbrTitle}
              width={40}
              height={40}
              className="rounded-coin"
            />
            <Image
              src={abbrSubLogo}
              alt={abbrTitle}
              width={20}
              height={20}
              className="absolute bottom-0 right-normal"
            />
          </div>
          <div className="ml-[8px]">
            <h3 className="text-coinLg font-500 text-coin">{abbrTitle}</h3>
            <p className="text-coinSm text-secondary">{abbrVersion}</p>
          </div>
        </div>

        <div className="text-right flex flex-row items-center">
          <span className="text-coinXl font-600">{abbrApy}</span>
          <div className="flex flex-col items-center justify-start ml-[2px]">
            <span className="text-coinSm text-primary">%</span>
            <p className="text-coinSm text-primary">APY</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link href={{pathname:'/asset',query:{abbrLogo,abbrTitle, abbrApy, abbrVersion,abbrExpireTime}}}>
          <div className="w-200 h-41 mt-2 bg-button text-primary text-center px-6 py-2 rounded-button shadow-sm cursor-pointer button-hover">
            Invest
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
