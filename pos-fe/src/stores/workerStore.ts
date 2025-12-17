import { handleError } from "@/helper/errors";
import { notify } from "@/helper/toastifyHelper";
import { api } from "@/services/apiService";
import { WorkerPayload } from "@/types/payloads/auth";
import { ResponseData } from "@/types/response";
import { defineStore } from "pinia";

export const workerStore = defineStore('worker', {
    state: () => ({

    }),
    actions: {
        async createWorker(payload: WorkerPayload) {
            try {
                const response = await api.post('/workers', payload)
                const result: ResponseData = response.data
                notify.success(result.message)
                return { ok: true }
            } catch (error) {
                handleError(error)
                return { ok: false }
            }
        },
        async getWorkers(businessId: string) {
            try {
                const response = await api.get(`/workers/${businessId}`)
                const result: ResponseData = response.data
                return { result, ok: true }
            } catch (error) {
                handleError(error)
                return { ok: false }
            }
        },
        async deleteWorker(businessId: string, workerId: string) {
            try {
                const response = await api.delete(`/workers/${businessId}/${workerId}`)
                const result: ResponseData = response.data
                notify.success(result.message)
                return { ok: true }
            } catch (error) {
                handleError(error)
                return { ok: false }
            }
        },
    }
})
