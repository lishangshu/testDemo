import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { productList }  from "@/configs/prodictList";
import { generateRandomString } from "@/commons/utils"
const CardSection = () => {
const newArray = productList.slice(0, 3);
  return (
    <section className="py-12 px-8 bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {newArray.map(item => (
           <Card
           key={generateRandomString(10)}
           abbrLogo={item.abbrLogo}
           abbrSubLogo={item.abbrSubLogo}
           abbrTitle={item.abbrTitle}
           abbrApy={item.abbrApy}
           abbrCycle={item.abbrCycle}
           abbrVersion={item.abbrVersion}
           abbrExpireTime={item.abbrExpireTime}
           pid={item.pid}
           contractAddress={item.contractAddress}
         />
        ))}
        {/* <Card
          logo="/tether.png"
          subLogo="/aave.png"
          title="USDT"
          apy="17.51"
          version="SHAMBHALA"
        />
        <Card
          logo="/solana.png"
          subLogo="/aave.png"
          title="SOL"
          apy="21.58"
          version="SHAMBHALA"
        />
        <Card
          logo="/avax.png"
          subLogo="/aave.png"
          title="AVAX"
          apy="23.57"
          version="SHAMBHALA"
        /> */}
      </div>
    </section>
  );
};

export default CardSection;
