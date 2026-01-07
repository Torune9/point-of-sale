import router from "@/router";

const allowedRoutes = ["transaction", "product"];

export const firedNotify = () => {
    const name = router.currentRoute.value.name;
    return typeof name === "string" && allowedRoutes.includes(name);
};
