import { notify } from "@/helper/toastifyHelper";
import { productStore } from "@/stores/productStore";
import { io } from "socket.io-client";
import { firedNotify } from "@/helper/firedNotifyRoutes";

let socket = null;


export const connectSocket = (token) => {
    if (socket) return socket;

    socket = io(import.meta.env.VITE_BASE_URL, {
        auth: { token },
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("socket connected:", socket.id);
    });

    socket.on("product:empty-stock", (data) => {
        productStore().updateStockProductState(data.product);
    });
    socket.on("product:stock-out-sales", (data) => {
        if (firedNotify()) {
            notify.info(data.message);
        }
        productStore().updateStockProductState(data.product);
    });
    socket.on("product:stock-update", (data) => {
        if (firedNotify()) {
            notify.info(data.message);
        }
        productStore().updateStockProductState(data.product);
    });

    socket.on("connect_error", (err) => {
        console.error("socket error:", err.message);
    });

    return socket;
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};
