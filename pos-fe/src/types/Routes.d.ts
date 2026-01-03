import { Component } from "vue";

interface BaseRoute {
    name: string,
    path: string,
    component?: Component,
    redirect? : {
        name : string
    },
    meta?: {}
}

export interface ChildRouteType extends BaseRoute {
    children?: BaseRoute[]
}
