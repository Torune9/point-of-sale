import { useError } from "@/composables/useError"
import { AxiosError } from "axios"
const errors = useError()

export const handleError = (error: any) => {
    if (error instanceof AxiosError) {

        if (error.code) {
            errors.networkErr(error)
        } else {
            errors.serverError(error)
        }
    }
}
