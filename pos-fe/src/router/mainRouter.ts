import { BaseRoute } from "@/types/routes";
import DashboardView from "@/views/main/DashboardView.vue";

export const mainRouter : BaseRoute[] = [
    {
        name : 'dashboard',
        path : '/dashboard',
        component : DashboardView,
        meta : {
            layout : "main"
        }
    }
]
