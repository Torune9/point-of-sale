import { notify } from "@/helper/toastifyHelper"
import { ResponseData } from "@/types/response"
import { AxiosError } from "axios"

export const useError = () => {
    const networkErr = (err: AxiosError) => {
        notify.error(err.message)
    }
    const serverError = (err: AxiosError) => {
        const error: ResponseData = err.response.data as ResponseData
        if (error?.error) {
            notify.error(error?.error)
        } else {
            notify.error(error.message)
        }
    }

    return {
        networkErr,
        serverError
    }
}
