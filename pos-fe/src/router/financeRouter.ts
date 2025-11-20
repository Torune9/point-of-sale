import { ChildRouteType } from "@/types/routes";
import CashFlowView from "@/views/main/finance/CashFlowView.vue";
import SalesView from "@/views/main/finance/SalesView.vue";

export const financeRouter: ChildRouteType[] = [
    {
        path: '/finance',
        name: 'finance',
        redirect : {
            name : 'cashFlow'
        },
        children: [
            {
                path: 'cash-flow',
                name: 'cashFlow',
                component: CashFlowView,
            },
            {
                path: 'sales',
                name: 'sales',
                component: SalesView,
            },
        ],
        meta: {
            layout: "main"
        }
    },
]
