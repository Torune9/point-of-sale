import { Component } from "vue";

interface BaseRoute {
    name: string,
    path: string,
    component?: Component,
    meta?: {
        layout: string
    }
}

export interface ChildRouteType extends BaseRoute {
    children?: BaseRoute[]
}
