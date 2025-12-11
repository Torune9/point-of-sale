export interface ResponseLogin {
    message: string,
    business: object[]
    token: string,
    code: number,
    data: object[],
    role: object
}

export interface ResponseData {
    message: string,
    code: number,
    data: any,
}
