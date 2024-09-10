import moment from "moment";
import { RowObject } from "@/components/Table/types";

export const marketDataSource = [
  {
    date: Date.now(),
    activity: "Activity 1",
    details: "0x73fh387w087e0qbv876653h9vn30",
    rewards: "100",
  },
  {
    date: Date.now(),
    activity: "Activity 2",
    details: "Aave Ethereum USDT Staking",
    rewards: "200",
  },
  {
    date: Date.now(),
    activity: "Activity 3",
    details: "0x73fh387w087e0qbv876653h9vn30",
    rewards: "300",
  },
];

// My-point/points-record 数据源
// export const pointsRecordDataSource = [
//   {
//     date: Date.now(),
//     details: "Activity 1",
//     rewards: "100",
//   },
//   {
//     date: Date.now(),
//     details: "Activity 2",
//     rewards: "200",
//   },
//   {
//     date: Date.now(),
//     details: "Activity 3",
//     rewards: "300",
//   },
// ];

// export const referralDetailDataSource = [
//   {
//     date: Date.now(),
//     address: "0x73fh387w087e0qbv876653h9vn30",
//     type: "Type 1",
//     rewards: "100",
//   },
//   {
//     date: Date.now(),
//     address: "0x73fh387w087e0qbv876653h9vn30",
//     type: "Type 2",
//     rewards: "200",
//   },
//   {
//     date: Date.now(),
//     address: "0x73fh387w087e0qbv876653h9vn30",
//     type: "Type 3",
//     rewards: "300",
//   },
// ];

export const rewardCenterDataSource = [
  {
    rewards: "100",
    reward: "Reward 1",
    details: "Details 1",
  },
  {
    rewards: "200",
    reward: "Reward 2",
  },
  {
    rewards: "300",
    reward: "Reward 3",
  },
];

export const marketColumns = [
  {
    title: <span className="flex items-center justify-start">Date</span>,
    dataIndex: "date",
    key: "date",
    render: (value: RowObject["date"]) => (
      <span className="w-full text-primary flex items-center justify-start">
        {moment(value).format("YYYY/MM/DD HH:mm")}
      </span>
    ),
  },
  {
    title: "Activity",
    dataIndex: "activity",
    key: "activity",
  },
  {
    title: "Details",
    dataIndex: "details",
    key: "details",
  },
  {
    title: <span className="flex items-center justify-center">Rewards</span>,
    dataIndex: "rewards",
    key: "rewards",
    render: (value: any) => {
      return (
        <span className="w-full text-primary flex items-center justify-center">
          {value} Points
        </span>
      );
    },
  },
];

// My-point/points-record
export const pointsRecordColumns = [
  {
    title: <span className="flex items-center justify-start">Date</span>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value: RowObject["date"]) => (
      <span className="w-full text-primary flex items-center justify-start">
        {moment(value).format("YYYY.MM.DD HH:mm")}
      </span>
    ),
  },
  {
    title: "Details",
    dataIndex: "type",
    key: "type",
    render: (value: any) => {
      return (
        <span className="w-full text-primary flex items-center justify-start">
          {value == 1?"是":"否"}
        </span>
      );
    },
  },
  {
    title: <span className="flex items-center justify-center">Points</span>,
    dataIndex: "pointChange",
    key: "pointChange",
    render: (value: any) => {
      return (
        <span className="w-full text-primary flex items-center justify-center">
          + {value} Points
        </span>
      );
    },
  },
];

// My Points-Points Record
export const referralDetailColumns = [
  {
    title: <span className="flex items-center justify-start">Date</span>,
    dataIndex: "updateAt",
    key: "updateAt",
    render: (value: RowObject["date"]) => (
      <span className="w-full text-primary flex items-center justify-start">
        {moment(value).format("YYYY.MM.DD HH:mm")}
      </span>
    ),
  },
  {
    title: "Address",
    dataIndex: "userId",
    key: "userId",
  },
  {
    title: <span className="flex items-center justify-center">Type</span>,
    dataIndex: "type",
    key: "type",
    render: (value: any) => {
      return (
        <span className="w-full text-primary flex items-center justify-center">
          {value == 1?"是":"否"}
        </span>
      );
    },
  },
  {
    title: <span className="flex items-center justify-center">Points</span>,
    dataIndex: "pointChange",
    key: "pointChange",
    render: (value: any) => {
      return (
        <span className="w-full text-primary flex items-center justify-center">
          + {value} Points
        </span>
      );
    },
  },
];

export const rewardCenterColumns = [
  {
    title: <span className="flex items-center justify-center">Points</span>,
    dataIndex: "rewards",
    key: "rewards",
    render: (value: any) => {
      return (
        <span className="w-full text-primary flex items-center justify-start">
          + {value} Points
        </span>
      );
    },
  },
  {
    title: "reward",
    dataIndex: "reward",
    key: "reward",
    render: (value: any) => {
      return (
        <span className="w-full text-primary flex items-center justify-center">
          + {value} Points
        </span>
      );
    },
  },
  {
    title: "action",
    dataIndex: "action",
    key: "action",
    render: (value: any) => {
      return (
        <div className="w-full flex justify-end">
          <span
            className="bg-[#0D0D0D] text-thirdary py-[11px] px-[22px] rounded-[30px] curosr-pointer button-hover"
            onClick={() => handleRedeem(value)}
          >
            Redeem
          </span>
        </div>
      );
    },
  },
];

const handleRedeem = (value: RowObject["action"]) => {};
