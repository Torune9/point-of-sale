import { notify } from "@/helper/toastifyHelper"
import { ResponseData } from "@/types/response"
import { AxiosError } from "axios"

export const useError = () => {
    const networkErr = (err: AxiosError) => {
        if (err.code) {
            notify.error(err.message)
        }
    }
    const serverError = (err: AxiosError) => {
        const error = err.response.data as ResponseData
        notify.error(error.message)
    }

    return {
        networkErr,
        serverError
    }
}
