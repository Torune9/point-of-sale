import { BaseRoute } from "@/types/routes";
import DashboardView from "@/views/main/DashboardView.vue";
import TransactionView from "@/views/main/TransactionView.vue";

export const mainRouter : BaseRoute[] = [
    {
        name : 'dashboard',
        path : '/dashboard',
        component : DashboardView,
        meta : {
            layout : "main"
        }
    },
    {
        name : 'transaction',
        path : '/transaction',
        component : TransactionView,
        meta : {
            layout : "main"
        }
    },
]
