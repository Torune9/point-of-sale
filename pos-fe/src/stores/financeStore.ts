import { handleError } from "@/helper/errors";
import { notify } from "@/helper/toastifyHelper";
import { api } from "@/services/apiService";
import { ResponseData } from "@/types/response";
import { defineStore } from "pinia";

export const financeStore = defineStore('finance', {
    state: () => ({
       
    }),
    actions: {
        async getCashFlow(businessId: string, type: string) {
            try {
                const response = await api.get(`/cash/${businessId}?type=${type}`)
                const result: ResponseData = response.data
                return { result, ok: true }
            } catch (error) {
                handleError(error)
                return { ok: false }

            }
        },
        async createCashFlow(payload: any) {
            try {
                console.log(payload);

                const response = await api.post(`/cash`, payload)
                const result: ResponseData = response.data
                notify.success(result.message)
                return { result, ok: true }
            } catch (error) {
                console.log(error);

                handleError(error)
                return { ok: false, error }

            }
        },

    }
})
