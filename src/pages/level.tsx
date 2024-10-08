import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import LevelSection from "@/Section/LevelSection";
import { useTranslation } from "react-i18next";
const Market: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <div>
      <Head>
        <title>{t("market")}</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Header logo switchTab />
      <LevelSection />
      <Footer />
    </div>
  );
};

export default Market;
