import "../src/css/style.css";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import { Icon } from "@iconify/vue";

import Vue3Toastify from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import { pinia } from "./helper/pinia";

const app = createApp(App);

app.use(Vue3Toastify, {
    autoClose: 3000,
});

app.component("Icon", Icon);

app.use(pinia);
app.use(router);

app.mount("#app");
