import { ChildRouteType } from "@/types/routes";
import ProductView from "@/views/main/inventory/ProductView.vue";

export const inventoryRouter: ChildRouteType[] = [
    {
        name: 'inventory',
        path: '/inventory',
        children: [
            {
                name: 'product',
                path: 'products',
                component : ProductView
            }
        ],
         meta: {
            layout: 'main'
        },
    }
]
