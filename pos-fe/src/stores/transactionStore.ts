import { defineStore } from "pinia";
import { CheckoutItems } from "@/types/checkoutItem";
import { notify } from "@/helper/toastifyHelper";
import { Checkout } from "@/types/checkout";
import { api } from "@/services/apiService";
import { ResponseData } from "@/types/response";
import { handleError } from "@/helper/errors";
import { StockMovement } from "@/types/stockMovement";

export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        items: []
    }),
    persist: true,
    actions: {
        async getStockMovement(businessId: string) {
            try {
                const response = await api.get(`/stock-movements/${businessId}`)
                const result: ResponseData = response.data
                return { ok: true, result }
            } catch (error) {
                handleError(error)
                return { ok: false, error }
            }
        },
        async stockMovement(payload: StockMovement) {
            try {
                const response = await api.post('/stock-movements', payload)
                const result: ResponseData = response.data
                console.log(result);
                return { ok: true, result }
            } catch (error) {
                console.log(error);

                handleError(error)
                return { ok: false, error }
            }
        },
        async selling(payload: Checkout, workerId: string) {
            try {
                const response = await api.post('/stock-movements/selling', {
                    ...payload,
                    workerId
                })
                const result: ResponseData = response.data
                notify.success(result.message)
                return { ok: true, result }
            } catch (error) {
                console.log(error);

                handleError(error)
                return { ok: false }
            }
        },
        pushToItem(item: CheckoutItems) {
            const idx = this.items.findIndex((val: CheckoutItems) => item.productId == val.productId)
            if (idx !== -1) {
                this.items[idx].quantity++
                this.items[idx].subTotal = this.items[idx].price * this.items[idx].quantity
                notify.success('quantity has been updated')
                return
            }
            this.items.push(item)
            notify.success('item has been added')
        },
        deleteItem(id: string) {
            this.items = this.items.filter((item: CheckoutItems) => item.productId !== id)
            notify.warning('item has been deleted')
        },
        updateItem(productId: String, quantity?: number, subTotal?: number) {
            const idx = this.items.findIndex((val: CheckoutItems) => productId == val.productId)
            if (idx !== -1) {
                this.items[idx].quantity += quantity
                this.items[idx].subTotal += subTotal
                notify.success('quantity has been updated')
            }
        },
        quantityIncrement(idx: number) {
            this.items[idx - 1].quantity++
            this.items[idx - 1].subTotal += this.items[idx - 1].price
        },
        quantityDecrement(idx: number) {
            if (this.items[idx - 1].quantity == 1) return
            this.items[idx - 1].quantity--
            this.items[idx - 1].subTotal -= this.items[idx - 1].price
        }
    }
})
