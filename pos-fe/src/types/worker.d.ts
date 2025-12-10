import { Role } from "./role"

export interface Worker {
    id: string,
    username : string,
    email : string,
    role : Role
    businessId : string
}
