import React, { useState, useEffect } from "react";
import Image from "next/image";
import Limit from "@/components/Limit";
import InputBalance from "@/components/InputBalance";
import LineCharts from "@/components/LineCharts";
import Loading from "@/components/Loading";
import { useTranslation } from "react-i18next";

import { toast } from 'react-toastify'
import { USDTVAULT_ERC20, USDT_ERC20 } from "@/commons/config";
import {
  readContract,
  writeContract,
  getTransactionReceipt,
  getAccount,
  getChainId
} from "@wagmi/core";
import { formatUsdt } from "@/commons/utils"
import { formatUnits } from "viem"
// import { config } from "@/wagmi";
import { config } from '@/providers/AppKitProvider'
import { useRouter } from 'next/router';
import { matchImg } from "@/commons/utils"
import moment from "moment"
import { useApolloClient, gql } from '@apollo/client';
import useStore from '@/store/index';

const AssetSection = () => {
  const { t } = useTranslation("common");
  const [selectedTab, setSelectedTab] = useState<"info" | "apy">("info");
  const [selectedRedeem, setSelectedRedeem] = useState<"invite" | "redeem">(
    "invite"
  );
  const client = useApolloClient();
  const [inputValue, setInputValue] = useState<number>(0.0);
  const [step, setStep] = useState<number>(0);
  const rate = 1;
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { abbrId, abbrLogo, abbrTitle, abbrApy, abbrVersion, abbrExpireTime, contractAddress, pid, abbrCycle } = router.query
  const [balance, setBalance] = useState(BigInt(0))
  const { userInfo } = useStore();
  const [receives, setReceives] = useState([])

  const [dailyEarn, setDailyEarn] = useState(0)
  const [totalEarn, setTotalEarn] = useState(0)

  const d = moment(abbrExpireTime).diff(moment(), 'days')
  const [points] = useState(parseInt(100 / abbrCycle * d) || 0)

  function inputChange(value) {
    setInputValue(value)
    setDailyEarn(formatUsdt((value || 0) * (abbrApy || 0) / 100 / 365, 4))
    setTotalEarn(formatUsdt((value || 0) * (abbrApy || 30) * (abbrApy || 0) / 100 / 365, 4))
  }

  function changeTab(tab: "invite" | "redeem") {
    if (busy) {
      return
    }
    setSelectedRedeem(tab)
    setStep(0)
    if (tab == "redeem") {
      getYourReceive()
    }
  }

  function getYourReceive() {
    const account = getAccount(config)
    return readContract(config, {
      abi: USDTVAULT_ERC20.abi,
      address: contractAddress,
      functionName: 'canHarvest',
      args: [pid, account.address]
    }).then(async res => {
      console.log('call canHarvest', res)
      if (res.length == 2) {
        const addrs = res[0]
        const values = res[1]
        const list = []
        for (var i = 0; i < values.length; i++) {
          const v = values[i]
          const addr = addrs[i]
          const [decimals, symbol] = await Promise.all([getDecimals(addr), getSymbol(addr)])
          console.log('decimals', decimals, 'symbol', symbol)
          list.push(`${formatUsdt(formatUnits(v, Number(decimals)), 4)} ${symbol}`)
        }
        setReceives(list)
      }
    }).catch(err => {
      toast.error(err.message)
    }).finally(() => {

    })
  }

  function getSymbol(address) {
    return readContract(config, {
      abi: USDT_ERC20.abi,
      address: address,
      functionName: 'symbol'
    })
  }

  function getDecimals(address) {
    return readContract(config, {
      abi: USDT_ERC20.abi,
      address: address,
      functionName: 'decimals'
    })
  }

  function getPoolInfo() {
    return readContract(config, {
      abi: USDTVAULT_ERC20.abi,
      address: contractAddress,
      functionName: "pools",
      args: [pid],
    });
  }

  function getPoolState() {
    return readContract(config, {
      abi: USDTVAULT_ERC20.abi,
      address: contractAddress,
      functionName: "poolState",
      args: [pid],
    });
  }

  function queryBalance() {
    const account = getAccount(config);
    // console.log("account", account);
    return readContract(config, {
      abi: USDT_ERC20.abi,
      address: USDT_ERC20.address,
      functionName: "balanceOf",
      args: [account.address]
    }).then(res => {
      setBalance(res)
    });
  }

  function getAllowance() {
    const account = getAccount(config);
    return readContract(config, {
      abi: USDT_ERC20.abi,
      address: USDT_ERC20.address,
      functionName: "allowance",
      args: [account.address, contractAddress],
    });
  }

  function investing(amount) {
    const account = getAccount(config);
    return writeContract(config, {
      abi: USDTVAULT_ERC20.abi,
      address: contractAddress,
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
      args: [contractAddress, amount],
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
    if (!account.address) {
      console.warn("Please connect wallet first");
      toast.error('Please connect wallet first!')
      return;
    }
    if (step == 0) {
      setStep(1)
      return
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
      if (inputValue <= 0) {
        console.warn("Asset must bigger than zero");
        toast.error("Asset must bigger than zero")
        setBusy(false);
        return;
      }
      const amount =
        BigInt(inputValue) * BigInt(Math.pow(10, Number(USDT_ERC20.decimals)));
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
        setStep(2);
        var hash = await approving(amount);
        console.log('approving resolved.hash is ', hash)
        if (await success(hash)) {
          setStep(3);
          hash = await investing(amount);
          console.log('investing resolved.hash is ', hash)
          if (await success(hash)) {
            console.log("Invest succeed");
            toast.success("Invest succeed")
            purchaseDefi({
              signedTx: hash
            })
            queryBalance()
          } else {
            console.warn("Invest failed");
            toast.error("Invest failed")
          }
          setStep(0);
        }
      } else {
        setStep(3);
        const hash = await investing(amount);
        if (await success(hash)) {
          console.log("Invest succeed");
          toast.success("Invest succeed")
          queryBalance()
          purchaseDefi({
            signedTx: hash
          })
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
      setStep(0);
    }
  }

  const getUserInfo = (address) => {
    return client.query({
      query: gql`
      query {
        getUser(input: { 
          address: "${address}" 
        }) {
          user {
            id
            address
            hashKey
            points
            inviteCode
            createdAt
            updatedAt
            deletedAt
          }
        }
      }
      `
    })
  }

  const purchaseDefi = async (parms: any) => {
    try {
      const account = getAccount(config)
      const userRes = await getUserInfo(2)
      console.log('userInfo', userInfo)
      const chainId = getChainId(config)
      await client.query({
        query: gql`
      query {
        purchaseDefi(input: { 
          id: "${abbrId || ''}",
          userId: "${userRes.data.getUser.user.id || ''}",
          signedTx: "${parms.signedTx}",
          userAddr: "${account.address}",
          chainCode: "${chainId}",
          amount: "${inputValue}"
        }) {
          success
          id
          amount
        }
      }
      `
      })
      console.log('purchaseDefi success')
    } catch (error) {
      console.error(error)
    }
  };

  function redeeming() {
    const account = getAccount(config);
    return writeContract(config, {
      abi: USDTVAULT_ERC20.abi,
      address: contractAddress,
      functionName: "redeem",
      args: [pid],
      account: account.address,
    });
  }
  
  async function handleRedeem() {
    if (busy) {
    	return
    }
    setBusy(true)
    try {
      const poolState = await getPoolState();
      console.log("pool state", poolState);
      if (poolState != 2) {
        console.warn("The product has not yet expired");
        //$toast('The product has not yet expired')
        //todo
        toast('The product has not yet expired')
        return;
      }
      // setState(1)
      const hash = await redeeming();
      if (await success(hash)) {
        console.log("Redeem succeed");
        //toast success todo
        toast.success('Redeem succeed')
        queryBalance()
      } else {
        console.warn("Redeem failed");
        //toast failed todo
        toast.error('Redeem failed')
      }
    } catch (e) {
      console.error(e);
      toast.error(e.message)
    } finally {
      setBusy(false)
    }
  }

  queryBalance()

  return (
    <section className="w-full bg-thirdary flex items-start pt-[86px] px-[109px]">
      <div className="max-w-[720px] w-2/3 mr-[52px] text-primary mb-[232px]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex justify-center items-between space-x-4">
            <div className="relative mr-2">
              <Image
                src={matchImg(abbrLogo)}
                alt={"tether"}
                width={60}
                height={60}
                className="rounded-coin"
              />
              <Image
                src={"/aave.png"}
                alt={"aave"}
                width={30}
                height={30}
                className="absolute bottom-0 right-normal"
              />
            </div>
            <div>
              <h1 className="text-coinLg font-500">{abbrTitle}</h1>
              <p className="text-coinSm text-secondary font-400">SHAMBHALA</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-baseline justify-between font-600 gap-2">
              <span className="text-[42px] flex justify-end">{abbrApy}%</span>
              <span className="text-coinSm">APY</span>
            </div>
            <div className="bg-manturity text-primary px-[9px] py-[5px] rounded-[2px] text-coinSm">
              Maturity: {abbrExpireTime}
            </div>
          </div>
        </div>

        <div className="flex space-x-6 mb-8">
          <div
            onClick={() => setSelectedTab("info")}
            className={`px-[24px] py-[10px] text-primary cursor-pointer ${selectedTab === "info" ? "bg-[#f1f1f1] rounded-[50px]" : ""
              }`}
          >
            Info
          </div>
          <div
            onClick={() => setSelectedTab("apy")}
            className={`px-[24px] py-[10px] text-primary cursor-pointer ${selectedTab === "apy" ? "bg-[#f1f1f1] rounded-[50px]" : ""
              }`}
          >
            APY
          </div>
        </div>

        {selectedTab === "info" && (
          <>
            <div className="mt-[20px] mb-[40px]">
              <h2 className="text-[16px] text-primary font-500 mb-[12px]">
                {t("about")}
              </h2>
              <p className="text-[12px] font-500 text-[#535353]">
                {t("about-content")}
              </p>
            </div>
            <div className="w-full h-[1px] bg-[#EBEBEB] mb-[22px]" />
            <div className="flex items-center justify-between gap-[110px] mb-[45px] text-primary text-[18px] font-400">
              <div className="flex flex-col items-start ">
                <span className="mb-[17px]">{t("earn")}</span>
                <div className="flex items-center gap-[2px]">
                  <Image src={"/usdc.png"} width={18} height={18} alt="eth" />
                  <p className="font-500">USDC</p>
                </div>
              </div>
              <div className="flex flex-col items-start ">
                <span className="mb-[17px]">TVL</span>
                <p className="font-500">$54.34M</p>
              </div>
              <div className="flex flex-col items-start ">
                <span className="mb-[17px]">{t("protocol")}</span>
                <div className="flex items-center gap-[2px]">
                  <Image src={"/aave.png"} width={18} height={18} alt="aave" />
                  <p className="font-500 ml-[5px]">SHAMBHALA</p>
                </div>
              </div>
              <div className="flex flex-col items-start ">
                <span className="mb-[17px]">{t("network")}</span>
                <div className="flex items-center gap-[5px]">
                  <Image src={"/eth.svg"} width={18} height={18} alt="eth" />
                  <p className="font-500">{t("ethereum")}</p>
                </div>
              </div>
            </div>
            <Limit
              progress={(45 / 94) * 100}
              current={"$4.5M"}
              total={"$9.4M"}
            />
          </>
        )}

        {selectedTab === "apy" && <LineCharts />}

        {/* FAQ 部分 */}
        <div className="mb-8 mt-[47px]">
          <h2 className="text-lg font-bold mb-[40px]">{t("faq")}</h2>
          <div className="w-full h-[1px] bg-[#EBEBEB] mb-[44px]" />
          <div className="mb-[68px]">
            <h3 className="text-[18px] font-500 mb-[30px]">{`What's Aave? How does it work?`}</h3>
            <p className="text-[12px] text-[#535353]">{t("faq-content")}</p>
          </div>

          <div className="w-full h-[1px] bg-[#EBEBEB]" />

          <div className="mt-[50px]">
            <h3 className="text-[18px] font-500 mb-[30px]">{t("ave")}</h3>
            <p className="text-[12px] text-[#535353]">{t("ave-content")}</p>
          </div>
        </div>
      </div>

      <div className="w-1/3 flex flex-col items-center justify-center">
        <div className="flex items-center mb-[31px] border border-[1px] border-[#E2E2E2] rounded-[50px]">
          <div
            onClick={() => changeTab("invite")}
            className={`m-[2px] px-[66px] py-[13px] text-primary cursor-pointer ${selectedRedeem === "invite" ? "bg-[#f1f1f1] rounded-[50px]" : ""
              }`}
          >
            {t("invite")}
          </div>
          <div
            onClick={() => changeTab("redeem")}
            className={`m-[2px] px-[66px] py-[13px] text-primary cursor-pointer ${selectedRedeem === "redeem" ? "bg-[#f1f1f1] rounded-[50px]" : ""
              }`}
          >
            {t("redeem")}
          </div>
        </div>

        <div className="w-full bg-thirdary shadow-card rounded-card text-primary px-[28px] py-[33px]">
          <div className="text-[12px] font-500 text-[#929292] flex items-center justify-end mb-[5px]">
            {t("balance")}: {formatUsdt(formatUnits(balance, USDT_ERC20.decimals), 2)} USDT
          </div>
          <InputBalance
            logo={"/usdc.png"}
            coinName={"USDC"}
            rate={rate}
            type="asset"
            maxValue={balance?.decimals || 0}
            onChange={inputChange}
          />

          <div className="w-full flex flex-col items-center justify-around text-secondary font-500 mt-[14px] mb-[38px]">
            {selectedRedeem == 'invite' ?
              <>
                <div className="w-full flex items-center justify-between">
                  <span className="text-[12px]">Est.daily</span>
                  <span className="text-[14px] text-primary">
                    {dailyEarn} USDT
                  </span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span className="text-[12px]">Est.receive</span>
                  <span className="text-[14px] text-primary">
                    {totalEarn} USDT
                  </span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span className="text-[12px]">Est.Points reward</span>
                  <span className="text-[14px] text-primary">
                    {points}
                  </span>
                </div>
              </>
              :
              <>
                <div className="w-full flex items-center justify-between">
                  <span className="text-[12px]">Your receive</span>
                  <div>
                    {
                      receives.map(item => (
                        <div className="text-[14px] text-primary">
                          {item}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </>
            }

            {(step === 1 || step === 2) && (
              <>
                <div className="w-full h-[1px] bg-[#ededed] mt-[25px]"></div>
                <div className="mt-[12px] w-full flex items-center justify-between">
                  <span className="text-[12px]">{t("network")}</span>
                  <span className="text-[14px] text-primary">
                    {t("ethereum")}
                  </span>
                </div>
                {/* <div className="w-full flex items-center justify-between">
                  <span className="text-[12px]">Investment Loss</span>
                  <span className="text-[14px] text-primary">
                    {(rate * inputValue).toFixed(2)}
                  </span>
                </div> */}
              </>
            )}
          </div>

          {
            selectedRedeem == 'invite' ?
              <div
                onClick={() => handleInvest()}
                className="w-full h-[60px] flex items-center justify-center bg-primary text-thirdary text-[16px] font-600 rounded-[20px] button-hover capitalize"
              >
                {step == 0 ? 'Invest' : step == 1 ? 'Step 1 of 2 : Approve USDC' : step == 2 ? (<Loading text='Approving' type="asset" />) : (<Loading text='Investing' type="asset" />)}
              </div>
              :
              <div
                onClick={() => handleRedeem()}
                className="w-full h-[60px] flex items-center justify-center bg-primary text-thirdary text-[16px] font-600 rounded-[20px] button-hover capitalize"
              >
                {!busy ? 'Redeem' : (<Loading text='Redeeming' type="asset" />)}
              </div>
          }

          {/* {(step === 1 || step === 2) && (
            <>
              <div className="mt-[15px] mb-[24px] w-full py-[14px] flex items-center justify-center gap-[19px] border border-[#EBEBEB] border-solid">
                <div className="flex items-center text-[12px] font-500 text-primary gap-[5px]">
                  1. Approve
                  <Image src={"/usdc.png"} width={18} height={18} alt="usdc" />
                </div>
                <Image
                  src={"/right-arrow.svg"}
                  width={20}
                  height={10}
                  alt="arrow"
                />
                <div className="flex items-center text-[12px] font-500 text-primary gap-[5px]">
                  2. Invest
                  <Image src={"/aave.png"} width={18} height={18} alt="usdc" />
                </div>
              </div>
              {!isLoading ? (
                <div
                  className="w-full h-[60px] flex items-center justify-center bg-primary text-thirdary text-[16px] font-600 rounded-[20px] button-hover"
                >
                  Step 1 of 2 : Approve USDC
                </div>
              ) : (
                <Loading text={step === 2 ? 'Approving' : step === 3 ? 'Investing' : ''} type="asset" />
              )}
            </>
          )} */}
        </div>
      </div>
    </section>
  );
};

export default AssetSection;
