import { notify } from "@/helper/toastifyHelper"
import { ResponseData } from "@/types/response"
import { AxiosError } from "axios"

export const useError = ()=>{
    const networkErr = (err: AxiosError)=>{
        if (err.code == "ERR_NETWORK") {
           notify.error(err.message)
        }
    }
    const serverError = (err: AxiosError)=>{
        if (err.response) {
            const error = err.response.data as ResponseData
            notify.error(error.message)
        }
    }
    
    return {
        networkErr,
        serverError
    }
}
