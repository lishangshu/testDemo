import MarketCard from "@/components/MarketCard";
import { useTranslation } from "react-i18next";
import { productList }  from "@/configs/prodictList";
import { generateRandomString } from "@/commons/utils"
const MarketSection = () => {
  const { t } = useTranslation("common");

  return (
    <section className="bg-bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-number text-center text-primary font-600 mb-[75px]">
          {t("discover-yield-markets")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {productList.map(item => (
          <MarketCard
            abbrId={item.id}
            key={generateRandomString(10)}
            logo={item.abbrLogo}
            subLogo={item.abbrSubLogo}
            coinName={item.abbrTitle}
            apy={item.abbrApy}
            cycle={item.abbrCycle}
            maturity={item.maturity}
            tvl={item.tvl}
            network={item.network}
            pid={item.pid}
            contractAddress={item.contractAddress}
          />
        ))}
          {/* <MarketCard
            logo="/solana.png"
            subLogo="/aave.png"
            coinName="SOL"
            apy={23.57}
            cycle={10}
            maturity="2024-09-15T07:58:00"
            tvl="10.5M"
            network="Ethereum"
            pid={0}
          />
          <MarketCard
            logo="/tether.png"
            subLogo="/aave.png"
            coinName="USDT"
            apy={23.57}
            cycle={15}
            maturity="2024-09-20T07:58:00"
            tvl="10.5M"
            network="Ethereum"
            pid={1}
          />
          <MarketCard
            logo="/usdc.png"
            subLogo="/aave.png"
            coinName="USDC"
            apy={23.57}
            cycle={30}
            maturity="2024-09-20T07:58:00"
            tvl="10.5M"
            network="Ethereum"
            pid={2}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default MarketSection;
