import api from "@/http/axios";
import { gql, useQuery } from "@apollo/client";

export async function getSignContent() {
  const response: any = await api("/v1/user/signature/text");
  console.log('response', response)
  if (response.code != 0) {
    throw new Error("Failed to fetch data");
  }
  return response.data;
}

export async function login({
  walletAddr,
  text,
  signature
}) {
  const response: any = await api("/v1/user/login", {
    method: 'post',
    data: {
      walletAddr,
      text,
      signature,
      inviteCode: localStorage.getItem("inviteCode") || ''
    }
  });
  if (response.code != 0) {
    throw new Error("Failed to fetch data");
  }
  return response.data;
}