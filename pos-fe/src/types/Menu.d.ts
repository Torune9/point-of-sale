export interface Menu {
    name: string,
    path: string,
    icon?: string
}

export interface SubMenu {
    name: string,
    path?: string,
    icon?: string
    items? : Menu[]
}

