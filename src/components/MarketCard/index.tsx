import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import InputCard from "../InputCard";
import moment from 'moment';
import { toast } from 'react-toastify'
import { matchImg } from "@/commons/utils"
import { USDTVAULT_ERC20, USDT_ERC20 } from "@/commons/config";
import {
  readContract,
  writeContract,
  getTransactionReceipt,
  getAccount,
} from "@wagmi/core";
import { config } from "@/wagmi";

interface MarketCardProps {
  logo: string;
  subLogo: string;
  coinName: string;
  apy: number;
  cycle: number|string;
  maturity: string;
  tvl: string;
  network: string;
  rate?: number;
  pid: number;
}

const MarketCard: React.FC<MarketCardProps> = ({
  logo,
  subLogo,
  coinName,
  apy,
  cycle,
  maturity,
  tvl,
  network,
  rate,
  pid
}) => {
  const [state, setState] = useState(0);
  const [busy, setBusy] = useState(false);
  const [inputAmount, setInputAmount] = useState(0);

  function getPoolInfo() {
    return readContract(config, {
      abi: USDTVAULT_ERC20.abi,
      address: USDTVAULT_ERC20.address,
      functionName: "pools",
      args: [pid],
    });
  }

  function getPoolState() {
    return readContract(config, {
      abi: USDTVAULT_ERC20.abi,
      address: USDTVAULT_ERC20.address,
      functionName: "poolState",
      args: [pid],
    });
  }

  function queryBalance() {
    const account = getAccount(config);
    console.log("account", account);
    return readContract(config, {
      abi: USDT_ERC20.abi,
      address: USDT_ERC20.address,
      functionName: "balanceOf",
      args: [account.address],
    });
  }

  function getAllowance() {
    const account = getAccount(config);
    return readContract(config, {
      abi: USDT_ERC20.abi,
      address: USDT_ERC20.address,
      functionName: "allowance",
      args: [account.address, USDTVAULT_ERC20.address],
    });
  }

  function investing(amount) {
    const account = getAccount(config);
    return writeContract(config, {
      abi: USDTVAULT_ERC20.abi,
      address: USDTVAULT_ERC20.address,
      functionName: "invest",
      args: [pid, amount],
      account: account.address,
    });
  }

  function approving(amount) {
    const account = getAccount(config);
    return writeContract(config, {
      abi: USDT_ERC20.abi,
      address: USDT_ERC20.address,
      functionName: "approve",
      args: [USDTVAULT_ERC20.address, amount],
      account: account.address,
    });
  }
  async function success(hash) {
    var retry = 5;
    while (retry > 0) {
      try {
        const res = await getTransactionReceipt(config, {
          hash
        });
        console.log("getTransactionReceipt", res);
        if (res) {
          return res.status == "success";
        }
        retry--;
      } catch (e) {
        console.error(e, config);
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      }
    }
  }

  async function handleInvest() {
    console.log("handle invest");
    const account = await getAccount(config);
    console.log('account', account);
    if (!account.address) {
      console.warn("Please connect wallet first");
      toast.error('Please connect wallet first!')
      return;
    }
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      const poolState = await getPoolState();
      console.log("pool state", poolState);
      if (poolState > 1) {
        console.log("Product has been ended");
        //toast todo
        toast.error("Product has been ended")
        return;
      }
      const balance = await queryBalance();
      console.log("balance", balance);
      if (inputAmount <= 0) {
        console.warn("Asset must bigger than zero");
        toast.error("Asset must bigger than zero")
        setBusy(false);
        return;
      }
      const amount =
        BigInt(inputAmount) * BigInt(Math.pow(10, Number(USDT_ERC20.decimals)));
      if (amount > balance) {
        console.warn("Insufficient balance");
        //$toast('Insufficient balance')
        toast.error("Insufficient balance")
        setBusy(false);
        return;
      }
      const allowance = await getAllowance();
      console.log("allowance", allowance);
      if (allowance < amount) {
        setState(1);
        var hash = await approving(amount);
        console.log('approving resolved.hash is ', hash)
        if (await success(hash)) {
          setState(2);
          hash = await investing(amount);
          console.log('investing resolved.hash is ', hash)
          if (await success(hash)) {
            console.log("Invest succeed");
            toast.error("Invest succeed")
          } else {
            console.warn("Invest failed");
            toast.error("Invest failed")
          }
          setState(0);
        }
      } else {
        setState(2);
        const hash = await investing(amount);
        if (await success(hash)) {
          console.log("Invest succeed");
          toast.error("Invest succeed")
        } else {
          console.warn("Invest failed");
          toast.error("Invest failed")
        }
      }
    } catch (e) {
      console.error(e);
      toast.error(e.message)
    } finally {
      setBusy(false);
      setState(0);
    }
  }

  // getPoolInfo().then(res => {
  //   console.log('pool info', res)
  // }).catch(err => {
  //   console.error(err)
  // })

  return (
    <div className="w-[500px] h-[473px]">
      <div className="w-full h-[90px] px-4 flex justify-between items-center mb-[5px] bg-market-card-bg rounded-card shadow-card text-primary">
        {/* 第一个部分 */}
        <div className="flex items-center">
          <div className="relative mr-2">
            <Image
              src={matchImg(logo)}
              alt={coinName}
              width={40}
              height={40}
              className="rounded-coin"
            />
            <Image
              src={subLogo}
              alt={coinName}
              width={20}
              height={20}
              className="absolute bottom-0 right-normal"
            />
          </div>
          <div className="ml-4 flex items-center gap-2">
            <h3 className="text-coinXl">{apy}</h3>
            <div>
              <p>%</p>
              <p className="text-primary text-coinSm">APY</p>
            </div>
          </div>
        </div>

        <div className="h-[40px] w-[1px] bg-[#ededed]"></div>

        <div className="ml-4 flex flex-col items-center gap-1">
          <p className="text-[22px] text-primary">{tvl}</p>
          <p className="text-[12px] text-secondary">TVL</p>
        </div>

        <div className="h-[40px] w-[1px] bg-[#ededed]"></div>

        <div className="ml-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-[2px]">
            <Image src={"/eth.svg"} width={16} height={16} alt="eth" />
            <p className="text-primary text-desc font-500">{network}</p>
          </div>
          <p className="text-desc text-secondary">Date: {moment(maturity).format('ll')}</p>
        </div>
      </div>
      <InputCard
        logo={matchImg(logo)}
        coinName={coinName}
        rate={rate || 1}
        network={network}
        apy={apy}
        cycle={cycle}
        maturity={maturity}
        onChange={(value) => setInputAmount(value)}
      />
      <div onClick={handleInvest} className="w-full h-[60px] flex items-center justify-center bg-primary text-thirdary text-[16px] font-600 rounded-[20px] button-hover">
        {state == 0 ? 'Invest' : state == 1 ? 'Approving' : 'Investing'}
      </div>
    </div>
  );
};

export default MarketCard;
