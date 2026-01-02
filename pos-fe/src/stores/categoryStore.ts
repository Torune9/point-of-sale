import { handleError } from "@/helper/errors";
import { notify } from "@/helper/toastifyHelper";
import { api } from "@/services/apiService";
import { ResponseData } from "@/types/response";
import { defineStore } from "pinia";

export const categoryStore = defineStore("catgeory", {
    state: () => ({

    }),
    actions: {
        async getCategories(businessId: string) {
            try {
                const response = await api.get(`/categories/${businessId}`)
                const result: ResponseData = response.data
                return { ok: true, result }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
        async createCategory(payload: { name: string, businessId: string }) {
            try {
                const response = await api.post(`/categories`, payload)
                const result: ResponseData = response.data
                notify.success(result.message)
                return { ok: true, result }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
        async deleteCategory(businessId: string, produdctId: string) {
            try {
                const response = await api.delete(`/categories/${businessId}/${produdctId}`)
                const result: ResponseData = response.data
                notify.success(result.message)
                return { ok: true, result }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
    }
})
