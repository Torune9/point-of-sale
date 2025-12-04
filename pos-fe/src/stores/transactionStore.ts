import { defineStore } from "pinia";
import { CheckoutItems } from "@/types/checkoutItem";
import { notify } from "@/helper/toastifyHelper";

export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        items: []
    }),
    persist: true,
    actions: {
        pushToItem(item: CheckoutItems) {
            const idx = this.items.findIndex((val) => item.id == val.id)
            if (idx !== -1) {
                this.items[idx].quantity++
                this.items[idx].totalPrice = this.items[idx].price * this.items[idx].quantity
                notify.success('quantity has been updated')
                return
            }
            this.items.push(item)
            notify.success('item has been added')
        },
        deleteItem(id: number) {
            this.items = this.items.filter((item: CheckoutItems) => item.id !== id)
            notify.warning('item has been deleted')
        },
        updateItem(selectedItem?: CheckoutItems, quantity?: number, totalPrice?: number) {
            const idx = this.items.findIndex((val) => selectedItem.id == val.id)
            if (idx !== -1) {
                this.items[idx].quantity += quantity
                this.items[idx].totalPrice += totalPrice
                notify.success('quantity has been updated')
            }
        },
        quantityIncrement(idx: number) {
            this.items[idx - 1].quantity++
            this.items[idx - 1].totalPrice += this.items[idx - 1].price
        },
        quantityDecrement(idx: number) {
            if (this.items[idx - 1].quantity == 1) return
            this.items[idx - 1].quantity--
            this.items[idx - 1].totalPrice -= this.items[idx - 1].price
        }
    }
})
