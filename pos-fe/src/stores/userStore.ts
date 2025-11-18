import { notify } from "@/helper/toastifyHelper";
import { api } from "@/services/apiService";
import { DataLogin } from "@/types/payloads/auth";
import { ResponseLogin } from "@/types/response";
import { defineStore } from "pinia";

export const userStore = defineStore('user', {
    state: () => ({
        token: null,
        userData: null,
        userBusiness: null
    }),
    persist: true,
    actions: {
        async userRegister(payload: DataLogin) {
            try {
                const response = await api.post('/auth/register', payload)

                const dataResponse: ResponseLogin = response.data as ResponseLogin

                this.token = dataResponse.token
                this.userData = dataResponse.data

                notify.success(dataResponse.message)

            } catch (error) {
                notify.error(error.response.data.message)
                throw error
            }
        },
        async login(payload: DataLogin,isWorker:boolean) {
            try {
                const path = isWorker ? '/auth/login/worker' : '/auth/login'
                const response = await api.post(path, payload)

                const result: ResponseLogin = response.data as ResponseLogin

                this.token = result.token
                this.userData = result.data
                this.userBusiness = result.business

                notify.success(result.message)

                return result

            } catch (error) {
                notify.error(error.response.data.message)
                throw error
            }
        },
    }
})
