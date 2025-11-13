export interface DataLogin {
    email : string,
    password : string
}


export interface DataRegister extends DataLogin {
    username : string
}
