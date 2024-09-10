import api from "@/http/axios";
import { gql, useQuery } from "@apollo/client";

// My Points->Points Record页面
export async function fetchPointsRecordTableData() {
  try {
    const response: any = await api("/api/list");
    if (!response.message) {
      throw new Error("Failed to fetch data");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    return [];
  }
}
// My Points->PReferral Detail页面
export async function fetchPointsReferralTableData() {
  try {
    const response: any = await api("/api/list");
    if (!response.message) {
      throw new Error("Failed to fetch data");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    return [];
  }
}

// 获取个人积分
export const useGetUserInfo = (parms?: any) => {
  console.log('oooooooooooooooo')
  const GET_USERS = gql`
  query {
  getUser(input:{
    id: "1"
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
  `;
  const { loading, error, data } = useQuery(GET_USERS);
  console.log("--------data--------", data);
  return { data };
};
