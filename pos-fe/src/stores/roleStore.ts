import { handleError } from "@/helper/errors";
import { api } from "@/services/apiService";
import { ResponseData } from "@/types/response";
import { defineStore } from "pinia";

export const roleStore = defineStore('role', {
    state: () => ({}),
    actions: {
        async getRoles() {
            try {
                const response = await api.get('/roles')
                const result: ResponseData = response.data
                return { result, ok: true }
            } catch (error) {
                handleError(error)
                return { ok: false }
            }
        }
    }
})
