import { toast } from "vue3-toastify"

class customToastify {
    default(message: string) {
        return toast(message, {
            type: 'default'
        })
    }
    success(message: string) {
        return toast(message, {
            type: 'success'
        })
    }
    info(message: string) {
        return toast(message, {
            type: 'info'
        })
    }
    warning(message: string) {
        return toast(message, {
            type: 'warning'
        })
    }
    error(message: string) {
        return toast(message, {
            type: 'error'
        })
    }
}

export const notify = new customToastify()
