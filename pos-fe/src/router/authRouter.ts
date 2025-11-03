import { RoutesType } from "@/types/Routes";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";

export const authRouter: RoutesType[] = [
    {
        name: 'login',
        path: '/sign-in',
        component: LoginView,
        meta: {
            layout: 'auth'
        }
    },
    {
        name: 'register',
        path: '/sign-up',
        component: RegisterView,
        meta: {
            layout: 'auth'
        }
    },

]
