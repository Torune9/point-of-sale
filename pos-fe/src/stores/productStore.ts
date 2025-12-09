import { notify } from "@/helper/toastifyHelper";
import { api } from "@/services/apiService";
import { ProductUpload, UpdateProduct } from "@/types/payloads/product";
import { ResponseData } from "@/types/response";
import { defineStore } from "pinia";

export const productStore = defineStore('product', {
    state: () => ({
        products: [] as Array<any>,
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
                return result;
            } catch (error) {
                const err = error.response.data as ResponseData
                if (err) {
                    notify.error(err.message ?? error.response.data.error)
                }
            }
        },
        async createProduct(payload: ProductUpload) {
            try {
                const response = await api.post('/products', payload)
                const result: ResponseData = response.data
                notify.success(result.message)
                return result
            } catch (error) {
                const err = error.response.data as ResponseData
                if (err) {
                    notify.error(err.message ?? error.response.data.error)
                }
            }
        },
        async updateProduct(payload: UpdateProduct, businessId: string, productId: string) {
            try {
                const response = await api.patch(`/products/${businessId}/${productId}`, payload)
                const result: ResponseData = response.data
                notify.success(result.message)
                return result
            } catch (error) {
                const err = error.response.data as ResponseData
                if (err) {
                    notify.error(err.message ?? error.response.data.error)
                } else {
                    notify.error('Error when update product')
                }
            }
        },
        async deleteProduct(businessId: string, productId: string) {
            try {
                const response = await api.delete(`products/${businessId}/${productId}`)
                const result: ResponseData = response.data
                notify.success(result.message)
                return result
            } catch (error) {
                const err = error.response.data as ResponseData
                if (err) {
                    notify.error(err.message)
                } else {
                    notify.error('Error when delete product')
                }
            }
        },
        async generateBarcode(businessId: string, productId: string) {
            try {
                const response = await api.post(`/products/qrcode/${businessId}/${productId}`)
                const result: ResponseData = response.data
                notify.success('qrcode successfully generated')
                return result
            } catch (error) {
                const err = error.response.data as ResponseData
                if (err) {
                    notify.error(err.message)
                } else {
                    notify.error('Error when generating qrcode')
                }
            }
        }
    }
})
