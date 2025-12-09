export function useConvert() {
    const covertToRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: "currency",
            currency: "IDR",
        }).format(num)
    }
    const convertToLocalDate = (date : string)=>{
        return new Date(date).toLocaleDateString()
    }

    return {
        covertToRupiah,
        convertToLocalDate
    }

}
