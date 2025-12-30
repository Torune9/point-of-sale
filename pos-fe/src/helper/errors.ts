import { useError } from "@/composables/useError"
import { AxiosError } from "axios"
const errors = useError()

export const handleError = (error: any) => {
    if (error instanceof AxiosError) {

        if (error.code == 'ERR_NETWORK') {
            errors.networkErr(error)
        } else if(error.response) {
            errors.serverError(error)
        }
    }
}
