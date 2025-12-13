import { handleError } from "@/helper/errors";
import { api } from "@/services/apiService";
import { defineStore } from "pinia";

export const businessStore = defineStore('business', {
    state: () => ({
        dataCash: []
    }),
    // persist : true,
    actions: {
        async getTotalBusinessCash(businessId: string) {
            try {
                const response = await api.get(`/cash/total/${businessId}`)

                const { totalIn, totalOut, balance } = response.data;

                this.dataCash = [
                    { "cash In": totalIn },
                    { "cash out": totalOut },
                    { "cash balance": balance }
                ];
                return { ok: true }

            } catch (error) {
                handleError(error)
                return { ok: false }
            }
        },
    }
}) 
