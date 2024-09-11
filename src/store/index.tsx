
import { create } from "zustand";
import { persist } from 'zustand/middleware';
const useStore = create(
    persist(
      (set) => ({
        userInfo:{},
        updateUserInfo:(state:any)=>{
            set({userInfo:state})
        }
      }),
      {
        name: 'my-store', // 存储在 localStorage 中的键名
        getStorage: () => localStorage, // 可选，默认为 localStorage
      }
    )
  );
export default useStore

