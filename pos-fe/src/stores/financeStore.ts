import { handleError } from "@/helper/errors";
import { notify } from "@/helper/toastifyHelper";
import { api } from "@/services/apiService";
import { ReportDate } from "@/types/finance";
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
                const response = await api.post(`/cash`, payload)
                const result: ResponseData = response.data
                notify.success(result.message)
                return { result, ok: true }
            } catch (error) {
                handleError(error)
                return { ok: false, error }

            }
        },
        async getSales(businessId: string, query?: ReportDate) {
            try {
                const response = await api.get(`/sales/${businessId}`, {
                    params: query
                })

                const result: ResponseData = response.data
                return { result, ok: true }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
        async createReport(businessId: string, payload: ReportDate) {
            try {
                const response = await api.get(
                    `/sales/report/${businessId}?startDate=${payload.startDate}&endDate=${payload.endDate}`,
                    {
                        responseType: "blob",
                    }
                );

                const blob = new Blob([response.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);

                window.open(url);
                return { ok: true }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        }


    }
})
