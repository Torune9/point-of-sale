import { CheckoutItems } from "./checkoutItem"

export interface Checkout {
    businessId : string,
    items : CheckoutItems[],
    totalAmount : number,
    paidAmount : number,
    workerId : string
}
