import { ChildRouteType } from "@/types/routes";
import CashFlowView from "@/views/main/finance/CashFlowView.vue";

export const financeRouter: ChildRouteType[] = [
    {
        path: '/finance',
        name: 'finance',
        children: [
            {
                path: 'cash-flow',
                name: 'cashFlow',
                component: CashFlowView,
            }
        ],
        meta: {
            layout: "main"
        }
    },
]
