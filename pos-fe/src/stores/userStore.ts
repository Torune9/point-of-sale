import { notify } from "@/helper/toastifyHelper";
import { api } from "@/services/apiService";
import { DataLogin } from "@/types/payloads/auth";
import { defineStore } from "pinia";

interface ResponseLogin {
    message: string,
    business : object[]
    token: string,
    code: number,
    data: object[]
}

export const userStore = defineStore('user', {
    state: () => ({
        token: null,
        userData: null
    }),
    persist: true,
    actions: {
        async userLogin(payload: DataLogin) {
            try {
                const response = await api.post('/auth/login', payload)
                const dataResponse: ResponseLogin = response.data as ResponseLogin
                
                this.token = dataResponse.token
                this.userData = dataResponse.data

                notify.success(dataResponse.message)

                return dataResponse

            } catch (error) { 
                notify.error(error.response.data.message)
                throw error
            }
        },
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
    }
})
