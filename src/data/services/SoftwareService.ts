import axiosInstance from "config/axios-config"

export const SoftwareService = {
    getDataSoftware: async () => {
        try {
            const response = await axiosInstance.get(`/adminuser/software-data`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message);
        }
    } 
}