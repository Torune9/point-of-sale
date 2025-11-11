import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { authRouter } from "./authRouter";
import { mainRouter } from "./mainRouter";
import NotFoundView from "@/views/NotFoundView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
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
        {
            path: "/:pathMatch(.*)*",
            name: "notfound",
            component: NotFoundView,
            meta : {
                layout : "empty"
            }
        },
    ],
});

export default router;
