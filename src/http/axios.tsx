// lib/axios.ts
import axios from "axios";
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    // "https://k8s-shambhal-userserv-761d9ad8ad-722783552.eu-west-1.elb.amazonaws.com",
    "https://api.shambhala.finance",
  // "http://47.115.60.170:8000/",
  timeout: 10000, // 设置请求超时时间
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 这里可以加入认证 token 之类的配置
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理响应错误，比如刷新 token 或者跳转登录页
    if (error.response?.status === 401) {
      console.log("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default api;
