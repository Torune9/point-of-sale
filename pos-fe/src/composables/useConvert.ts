export function useConvert() {
    const covertToRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: "currency",
            currency: "IDR",
        }).format(num)
    }

    return {
        covertToRupiah
    }

}
