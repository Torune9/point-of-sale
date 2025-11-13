import "../src/css/style.css";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router/index.js";

import { Icon } from "@iconify/vue";
import { pinia } from "./helper/pinia.js";

import Vue3Toastify from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const app = createApp(App);

app.use(Vue3Toastify, {
    autoClose: 3000,
});

app.component('EasyTable', Vue3EasyDataTable);
app.component("Icon", Icon);

app.use(pinia);
app.use(router);

app.mount("#app");
