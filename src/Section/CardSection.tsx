import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { productList }  from "@/configs/prodictList";
const CardSection = () => {
  return (
    <section className="py-12 px-8 bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {productList.map(item => (
           <Card
           key={item.apy}
           logo={item.logo}
           subLogo={item.subLogo}
           title={item.title}
           apy={item.apy}
           maturity={item.maturity}
           pid={item.pid}
           cycle={item.cycle}
           contractAddress={item.contractAddress}
           version={item.version}
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
