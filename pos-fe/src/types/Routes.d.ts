import { Component } from "vue";

export interface RoutesType {
    name: string,
    path: string,
    component: Component,
    meta?: {
        layout : string
    }
}
