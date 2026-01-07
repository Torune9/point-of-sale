import { userStore } from "@/stores/userStore";
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API,
});

api.interceptors.request.use(
    function (config) {
        const storeUser = userStore()        
        config.headers.Authorization = `Bearer ${storeUser.token}`

        return config;
    },
    function (err) {
        return Promise.reject(err);
    }
);
