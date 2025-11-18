import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { authRouter } from "./authRouter.js";
import { mainRouter } from "./mainRouter.js";
import NotFoundView from "@/views/NotFoundView.vue";
import { financeRouter } from "./financeRouter.js";
import { inventoryRouter } from "./inventoryRouter.js";
import PeopleView from "@/views/main/PeopleView.vue";

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
            name : 'people',
            path : '/people',
            component : PeopleView,
            meta : {
                layout : "main"
            }
        },
        {
            path: "/:pathMatch(.*)*",
            name: "notfound",
            component: NotFoundView,
            meta: {
                layout: "empty"
            }
        },
    ],
});

export default router;
