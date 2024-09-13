import Limit from "@/components/Limit";
import Referral from "@/components/Referral";
import Table from "@/components/Table";
import { levelColumns, levelDataSource } from "@/configs/level";
import { useTranslation } from "react-i18next";
import useStore from '@/store/index';
import { useApolloClient, gql } from '@apollo/client';
import { useEffect,useState } from "react";
import { inviteUrl } from '@/configs/baseUrl'
const LevelSection = () => {
  const { integralInfo } = useStore();
  const { t } = useTranslation("common");
  const client = useApolloClient();
  const [pointReward, setPointReward] = useState<number>(0);
  const [directReferrals, setDirectReferrals] = useState<number>(0);
  const [shareUrl,setShareUrl] = useState('')
  // pointlog
  const loadPointData = async (parms:any) => {
    await client.query({
      query: gql`
      query {
      pointLogs(input: {
        userId: ${parms.variables},
        pageSize: 10,
        pageNum: 0
      }) {
        id
        userId
        pointChange
        type
        createdAt
        updatedAt
        deletedAt
      }
    }
      `
    }).then(res=>{
      let total = 0
      res.data.pointLogs.forEach(item=>{
        console.log('++',item)
        total += item.pointChange  
      })
      setDirectReferrals(res.data.pointLogs.length)
      setPointReward(total)
    })
    
  };
  useEffect(() => {
    setShareUrl(inviteUrl+'?inviteCode=' + integralInfo.inviteCode)
    loadPointData({
      variables: integralInfo.id
    });
  },[])
  return (
    <section className="bg-bg-primary w-full min-h-screen py-[135px]">
      <h1 className="text-[34px] font-800 text-primary mb-[85px] ml-[105px]">
        Referral
      </h1>

      <div className="w-full h-[300px] px-[105px] bg-primary flex justify-between items-center text-[24px] font-600 text-thirdary mb-[80px]">
        <div className="text-[32px] font-600">
          <h1 className="text-[40px] font-600">{t("refer-friend")}</h1>
          <span className="text-[28px] font-400">{t("earn-points")}</span>
        </div>
        <div className="w-[600px]">
          <Referral link={shareUrl } />
        </div>
      </div>

      <h1 className="mt-[20px] font-600 text-[32px] ml-[105px]">
        {t("level-reward")}
      </h1>

      <div className="flex items-start justify-between mx-[105px] mt-[20px]">
        <div className="flex items-start space-x-6">
          <div className="w-[260px] flex flex-col px-[30px] py-[9px] text-primary rounded-card shadow-tableCard">
            <span className="text-primary text-[16px] font-400">
              {t("point-reward")}
            </span>
            <span className="text-primary text-[28px] font-600">{pointReward}</span>
          </div>

          <div className="w-[260px] flex flex-col px-[30px] py-[9px] text-primary rounded-card shadow-tableCard">
            <span className="text-primary text-[16px] font-400">
              {t("direct-referrals")}
            </span>
            <span className="text-primary text-[28px] font-600">{directReferrals}</span>
          </div>
        </div>

        <div className="w-[600px]">
          <Limit
            progress={(0 / 0) * 100}
            current={"0"}
            total={"0"}
            footer={false}
            title="Level"
          />
        </div>
      </div>

      <div className="mt-[50px] ml-[105px]">
        <Table
          columns={levelColumns as any}
          dataSource={levelDataSource as any}
        />
      </div>
    </section>
  );
};

export default LevelSection;
