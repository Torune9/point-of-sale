import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { authRouter } from "./authRouter.js";
import { mainRouter } from "./mainRouter.js";
import NotFoundView from "@/views/NotFoundView.vue";
import { financeRouter } from "./financeRouter.js";
import { inventoryRouter } from "./inventoryRouter.js";
import PeopleView from "@/views/main/PeopleView.vue";
import { userStore } from "@/stores/userStore.js";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: {
                layout: "minimal",
            },
        },
        ...authRouter,
        ...mainRouter,
        ...financeRouter,
        ...inventoryRouter,
        {
            name: "people",
            path: "/people",
            component: PeopleView,
            meta: {
                layout: "main",
            },
        },
        {
            path: "/:pathMatch(.*)*",
            name: "notfound",
            component: NotFoundView,
            meta: {
                layout: "empty",
            },
        },
    ],
});

router.beforeEach((to, from) => {
    const user = userStore();
    const isLogged = user.isLogged;
    const requiresAuth = to.meta.isAuth;

    if (!isLogged && requiresAuth) {
        return { name: "home" };
    }

    if (isLogged && !requiresAuth) {
        return { name: "dashboard" };
    }
});

export default router;
