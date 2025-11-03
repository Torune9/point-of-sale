import { ref, onMounted, onUnmounted } from "vue"

export function useResize(breakpoint = 768) {
    const width = ref(window.innerWidth)
    const isMobile = ref(window.innerWidth <= breakpoint)

    const handleResize = () => {
        width.value = window.innerWidth
        isMobile.value = window.innerWidth <= breakpoint
    }

    onMounted(() => {
        window.addEventListener("resize", handleResize)
    })

    onUnmounted(() => {
        window.removeEventListener("resize", handleResize)
    })

    return { width, isMobile }
}
