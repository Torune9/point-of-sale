import { ChildRouteType } from "@/types/routes";
import ProductView from "@/views/main/inventory/ProductView.vue";
import StockMovementView from "@/views/main/inventory/StockMovementView.vue";

export const inventoryRouter: ChildRouteType[] = [
    {
        name: 'inventory',
        path: '/inventory',
        redirect : {name : 'product'},
        children: [
            {
                name: 'product',
                path: 'products',
                component : ProductView
            },
            {
                name: 'stockMovent',
                path: 'stock-movements',
                component : StockMovementView
            },
        ],
         meta: {
            layout: 'main'
        },
    }
]
