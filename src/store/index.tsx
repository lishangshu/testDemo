
import { create } from "zustand";
import { persist } from 'zustand/middleware';
const useStore:any = create(
    persist(
      (set) => ({
        isLogin: false,
        userInfo:{},
        integralInfo:{},
        productArray:[],
        updateUserInfo:(state:any)=>{
            set({userInfo:state})
        },
        updateIntegralInfo:(state:any)=>{
            set({integralInfo:state})
        },
        updateProductArray:(state:any)=>{
          set({productArray:state})
      },
        updateIsLogin: (flag: any) => set({ isLogin: flag }),
      }),
      {
        name: 'my-store', // 存储在 localStorage 中的键名
        getStorage: () => localStorage, // 可选，默认为 localStorage
      }
    )
  );
export default useStore

