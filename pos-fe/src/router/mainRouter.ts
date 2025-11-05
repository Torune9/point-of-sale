import { RoutesType } from "@/types/Routes";
import DashboardView from "@/views/main/DashboardView.vue";

export const mainRouter : RoutesType[] = [
    {
        name : 'dashboard',
        path : '/dashboard',
        component : DashboardView
    }
]
