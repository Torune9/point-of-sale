import { notify } from "@/helper/toastifyHelper";
import { api } from "@/services/apiService";
import { ProductUpload, UpdateProduct } from "@/types/payloads/product";
import { ResponseData } from "@/types/response";
import { defineStore } from "pinia";
import { handleError } from "@/helper/errors";
import { Product } from "@/types/product";

export const productStore = defineStore('product', {
    state: () => ({
        products: [],
    }),
    actions: {
        async getProduct(businessId: string, categoryId?: string) {
            try {
                const response = await api.get(`/products/${businessId}`, {
                    params: {
                        categoryId
                    }
                });
                const result: ResponseData = response.data;
                this.products = result.data
                return { ok: true, result }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
        async createProduct(payload: ProductUpload) {
            try {
                const response = await api.post('/products', payload)
                const result: ResponseData = response.data
                notify.success(result.message)
                return { ok: true, result }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
        async updateProduct(payload: UpdateProduct, businessId: string, productId: string) {
            try {

                const response = await api.patch(`/products/${businessId}/${productId}`, payload)
                const result: ResponseData = response.data
                notify.success(result.message)
                return { ok: true, result }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
        async deleteProduct(businessId: string, productId: string) {
            try {
                const response = await api.delete(`products/${businessId}/${productId}`)
                const result: ResponseData = response.data
                notify.success(result.message)
                return { ok: true, result }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
        async generateBarcode(businessId: string, productId: string) {
            try {
                const response = await api.post(`/products/qrcode/${businessId}/${productId}`)
                const result: ResponseData = response.data
                notify.success('qrcode successfully generated')
                return { ok: true, result }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
        updateStockProductState(payload) {    
            const index = this.products.findIndex(
                p => p.id === payload.id
            );
            this.products[index].stock = payload.stock        
        }
    },

    getters: {
        getProducts (state): Product[] {
            return state.products
        },
    }
})
