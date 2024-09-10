import api from "@/http/axios";
export async function fetchPointsRecordTableData() {
    try {
      const response:any = await api('/api/list'); // 调用 API 路由
      if (!response.message) {
        throw new Error('Failed to fetch data');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching table data:', error);
      return [];
    }
  }

  export async function fetchPointsReferralTableData() {
    try {
      const response:any = await api('/api/list'); // 调用 API 路由
      if (!response.message) {
        throw new Error('Failed to fetch data');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching table data:', error);
      return [];
    }
  }