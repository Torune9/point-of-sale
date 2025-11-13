import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use(
    function (config) {;
        return config;
    },
    function (err) {
        return Promise.reject(err);
    }
);
