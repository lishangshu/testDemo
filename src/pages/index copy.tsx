import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "@/components/Header";
import Banner from "@/components/Banner";
import Earn from "@/components/Earn";
import { Footer } from "@/components/Footer";
import CardSection from "@/Section/CardSection";
import HomeSwitchSection from "@/Section/HomeSwitchSection";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const Home: NextPage = () => {
  const router = useRouter();
  const { inviteCode } = router.query;
  if (inviteCode) {
    localStorage.setItem("inviteCode", inviteCode);
  }
  const { t } = useTranslation("common");

  return (
    <div>
      <Head>
        <title>{t("title")}</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Header />
      <HomeSwitchSection />
      <Banner />
      <CardSection />
      <Earn />
      <Footer />
    </div>
  );
};

export default Home;
