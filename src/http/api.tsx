import api from "@/http/axios";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import axios from 'axios'
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

// My Points->PReferral Detail页面
export async function getProductListApi() {
  try {
    axios.get('https://apitest.upsurge.finance/poolInfo/v1/avaliable')
    .then(response=>{
      if(response.data.code == 200){
        console.log('xxxxxxxxxxxxxxx',response.data.data)
      }
    })
    .catch(error=>console.error(error))
  } catch (error) {
    console.error("Error fetching table data:", error);
    return [];
  }
}


export const refetchQuery = (parms?: any) => {
  const GET_USERS = gql`
  query {
  getUser(input:{
     id: ${parms.variables}
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
