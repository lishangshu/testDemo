/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "@/components/Header";
import Banner from "@/components/Banner";
import Earn from "@/components/Earn";
import { Footer } from "@/components/Footer";
import CardSection from "@/Section/CardSection";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useGetUserInfo} from '@/http/api';
const Home: NextPage = () => {
  const { t } = useTranslation("common");
  useGetUserInfo();
  return (
    <div>
      <Head>
        <title>{t("earn")}</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Header logo switchTab type="fixed" tabType="normal" />
      <Banner />
      <CardSection />
      <Earn col />
      <Footer />
    </div>
  );
};

export default Home;
