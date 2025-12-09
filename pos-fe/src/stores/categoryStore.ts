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
                return result
            } catch (error) {
                notify.error("error when getting categories")
                throw error
            }
        }
    }
})
