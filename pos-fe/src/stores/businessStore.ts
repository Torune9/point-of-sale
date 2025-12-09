import { notify } from "@/helper/toastifyHelper";
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
                const response = await api.get(`/cash/${businessId}`)
                
                const { totalIn, totalOut, balance } = response.data;

                this.dataCash = [
                    { "cash In": totalIn },
                    { "cash out": totalOut },
                    { "cash balance": balance }
                ];

            } catch (error) {
                console.log(error);
                notify.error(error.response.data.message)

            }
        }
    },
}) 
