<template>
    <div class="h-full grid grid-rows-4 max-lg:flex max-lg:flex-col grid-cols-5 gap-2 max-sm:gap-8">
        <BarcodeScanner @get-data="getData" />
        <!-- Header transaction -->
        <div class="col-span-5 grid grid-cols-[1fr_auto_auto] max-sm:grid-cols-2 gap-2">
            <!-- Core searching -->
            <div>
                <!-- Search input -->
                <div class="flex flex-col gap-y-2 relative">
                    <label for="search">search</label>

                    <div class="flex flex-row border border-black/20 rounded-md hover:outline overflow-hidden">
                        <input placeholder="search product..." type="text" id="search" v-model="search"
                            list="product-list" class="p-2 w-full focus:outline-0 bg-white" autocomplete="off" />
                        <button class="border-l-0 px-2 cursor-pointer group bg-white" @click="triggerDropdown">
                            <Icon icon="heroicons:chevron-down-16-solid" class="transition-all duration-300" :class="{
                                'rotate-x-180': isOpen || showDropdown
                            }" />
                        </button>
                    </div>
                    <!--List item -->
                    <Transition name="fade">
                        <ul v-if="showDropdown" id="product-list"
                            class="flex flex-col gap-y-2 absolute w-full z-50 bg-white top-full max-h-72 overflow-y-auto scroll p-2 shadow-md rounded-md">
                            <li @mousedown.prevent="selectItems(item)" v-for="item in filteredProducts" :key="item.id"
                                class="cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors duration-300">
                                <span>
                                    {{ item.name }}
                                </span>
                            </li>
                            <span v-if="filteredProducts.length == 0">
                                not found
                            </span>
                        </ul>
                    </Transition>
                </div>
            </div>
            <div class="inline-flex gap-x-2">
                <div class="shrink-0">
                    <TextInput :disabled="isStockOut" label="quantity" v-model="quantity" type="number"
                        @on-input-update="quantityTyping" />
                    <small v-if="selectedItem" class="font-semibold">
                        Available stock :
                        <span :class="{
                            'text-red-600': selectedItem.stock == 0
                        }">{{ selectedItem.stock }}</span>
                    </small>
                </div>
                <InputCurrency label="price" v-model="display.price" :disabled="true" />
            </div>
            <div class="self-end inline-flex gap-x-2 justify-between col-span-3">
                <BaseButton :is-disable="isStockOut" type="button" @click="addToCheckoutItems">
                    <template #title-btn>
                        submit
                    </template>
                </BaseButton>
                <BaseButton type="button" type-btn="info" @click="scanStart">
                    <template #title-btn>
                        Scan
                    </template>
                </BaseButton>
            </div>
        </div>
        <!-- Table transaction -->
        <div class="row-span-3 col-span-3 capitalize">
            <EasyTable :headers="headers" :items="items" table-class-name="customize-table" show-index alternating
                :rows-per-page="8">
                <template #item-price="{ price }">
                    <span>{{ convert.covertToRupiah(price) }}</span>
                </template>
                <template #item-quantity="{ productId, quantity, index }">
                    <div class="inline-flex gap-x-4 relative">
                        <div class="inline-flex">
                            <button v-if="activeId == productId" @click="quantityDecrement(index)"
                                class="border bg-gray-200 border-gray-300 hover:bg-gray-300 transition-colors rounded-full cursor-pointer p-1 ">
                                <icon icon="heroicons:minus-16-solid" />
                            </button>
                            <span class="mx-2">{{ quantity }}</span>
                            <button v-if="activeId == productId" @click="quantityIncrement(index)"
                                class="border bg-gray-200 border-gray-300 hover:bg-gray-300 transition-colors rounded-full cursor-pointer p-1  right-full">
                                <icon icon="heroicons:plus-16-solid" />
                            </button>
                        </div>
                        <button v-if="activeId == productId" @click="() => activeId = null"
                            class="border bg-green-200 border-green-400 rounded-full cursor-pointer p-1 hover:bg-green-300 transition-colors">
                            <Icon icon="heroicons:check-16-solid" />
                        </button>
                    </div>
                </template>
                <template #item-subTotal="{ subTotal }">
                    <span>{{ convert.covertToRupiah(subTotal) }}</span>
                </template>
                <template #item-action="{ productId }">
                    <div class="inline-flex gap-1 py-1">
                        <BaseButton size="auto" type="button" type-btn="info" @click="editQuantity(productId)">
                            <template #title-btn>
                                <Icon icon="heroicons:pencil-square-20-solid" />
                            </template>
                        </BaseButton>
                        <BaseButton size="auto" type="button" type-btn="danger" @click="deleteItem(productId)">
                            <template #title-btn>
                                <Icon icon="heroicons:trash-16-solid" />
                            </template>
                        </BaseButton>
                    </div>
                </template>
            </EasyTable>
        </div>
        <!-- Info transaction -->
        <div class=" row-span-3 col-span-2 bg-white outline outline-black/10 p-4 rounded-2xl flex flex-col gap-y-2">
            <Title tag="h3" class="text-center">Information</Title>
            <form @submit.prevent="checkout" class="h-full flex flex-col gap-y-2">
                <InputCurrency :disabled="true" label="total amout" v-model="display.totalAmount" placeholder="0" />
                <InputCurrency label="paid amount" v-model="display.paidAmount" placeholder="0"
                    :error-message="v$.paidAmount.$error ? v$.paidAmount.$errors : null" />
                <InputCurrency :disabled="true" label="change amount" v-model="changeAmount" placeholder="0" />
                <BaseButton type="submit" :is-disable="isDisableCheckoutBtn">
                    <template #title-btn>
                        Checkout
                    </template>
                </BaseButton>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atom/BaseButton.vue';
import InputCurrency from '@/components/atom/InputCurrency.vue';
import TextInput from '@/components/atom/TextInput.vue';
import Title from '@/components/atom/Title.vue';
import BarcodeScanner from '@/components/molecules/BarcodeScanner.vue';
import { useConvert } from '@/composables/useConvert';
import { productStore } from '@/stores/productStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { userStore } from '@/stores/userStore';
import { Checkout } from '@/types/checkout';
import { Product } from '@/types/product';
import useVuelidate from '@vuelidate/core';
import { helpers, minValue, required } from '@vuelidate/validators';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, provide, reactive, ref, toRef, watch } from 'vue';
import { Header } from 'vue3-easy-data-table';

const convert = useConvert()

const storeProduct = productStore()
const transactionStore = useTransactionStore()
const { items } = storeToRefs(transactionStore)
const {
    pushToItem,
    updateItem,
    deleteItem,
    quantityIncrement,
    quantityDecrement
} = transactionStore
const storeUser = userStore()

const headers = ref<Header[]>([
    {
        text: 'name',
        value: 'name',
    },
    {
        text: 'price',
        value: 'price'
    },
    {
        text: 'quantity',
        value: 'quantity',

    },
    {
        text: 'Subtotal',
        value: 'subTotal'
    },
    {
        text: 'action',
        value: 'action'
    }
])
const products = ref<Product[]>()
const quantity = ref<number>(1)
const search = ref('')
const selectedItem = ref<Product>()
const isOpen = ref(false)

const subTotal = computed<number>(() => {
    if (selectedItem.value) {
        return Number(selectedItem.value.price) * quantity.value
    } else { return 0 }
})

const display = reactive({
    price: 0,
    totalAmount: 0,
    paidAmount: 0,
})

const changeAmount = computed(() => {
    if (display.paidAmount == 0) {
        return 0
    }
    return Math.abs(display.totalAmount - display.paidAmount)
})

const rules = computed(() => ({
    paidAmount: {
        required,
        minValue: helpers.withMessage('value must be higher or equal to the total amount', minValue(toRef(display, 'totalAmount')))
    }
}))

const isDisableCheckoutBtn = computed(() => {
    return !display.paidAmount || selectedItem.value?.stock == 0
})
const isStockOut = computed(() => selectedItem.value?.stock == 0)
const v$ = useVuelidate(rules, { paidAmount: toRef(display, 'paidAmount') })


const triggerDropdown = () => {
    selectedItem.value = null
    search.value = ''
    isOpen.value = !isOpen.value
}

const filteredProducts = computed<Product[]>(() => {
    if (!search.value.trim() || isOpen.value) return products.value
    return products.value.filter(p =>
        p.name.toLowerCase().includes(search.value.toLowerCase())
    )
})

const showDropdown = computed(() => {
    if (selectedItem.value) return false
    return isOpen.value || search.value.length > 0
})

const selectItems = (item: Product) => {
    selectedItem.value = item
    quantity.value = 1
    search.value = item.name
    isOpen.value = false
}

const addToCheckoutItems = () => {

    if (selectedItem.value) {
        const payload = {
            productId: selectedItem.value.id,
            name: selectedItem.value.name,
            price: selectedItem.value.price,
            quantity: quantity.value,
            subTotal: subTotal.value,
        }
        const isExist = items.value.some((val) => val.productId == selectedItem.value.id)
        if (isExist) {
            updateItem(selectedItem.value.id, quantity.value, subTotal.value)
        } else {
            pushToItem(payload)
        }
    }

    search.value = ''
    selectedItem.value = null
    quantity.value = 1
}

const activeId = ref<number | null>(null)
const editQuantity = (id: number) => {
    if (activeId.value == id) {
        return activeId.value = null
    }
    activeId.value = id
}

const isActive = ref<boolean>(false)
const scanStart = () => {
    isActive.value = !isActive.value
}

const getData = (data: string) => {
    const result = JSON.parse(data)
    pushToItem({
        productId: result.id,
        name: result.name,
        price: result.price,
        quantity: quantity.value,
        subTotal: quantity.value * Number(result.price)
    })
}
// serve isActive for component
provide('isActive', isActive)


const checkoutPayload = computed<Checkout>(() => ({
    businessId: storeUser.userBusiness.id,
    items: items.value,
    totalAmount: Number(display.totalAmount),
    paidAmount: Number(display.paidAmount),
    workerId: storeUser.userData.id
}))

const checkout = async () => {

    v$.value.$touch()

    if (!await v$.value.$validate()) return
    try {
        await transactionStore.selling(checkoutPayload.value, storeUser.userData.id)
        Object.assign(display, {
            price: 0,
            totalAmount: 0,
            paidAmount: 0,
            changeAmount: 0
        })

    } finally {
        items.value = []
    }
}
const getProducts = async () => {
    try {
        const response = await storeProduct.getProduct(storeUser.userBusiness.id)
        products.value = response.data
    } catch (error) {
        console.log(error);

    }
}
const quantityTyping = (data) => {
    if (data === '' || data === null) {
        quantity.value = 1
    }
}

watch(subTotal, (val) => {
    display.price = val
})

watch(search, async (val) => {
    const text = val.toLowerCase()
    if (selectedItem.value && selectedItem.value.name.toLowerCase() !== text) {
        await nextTick()
        selectedItem.value = null
    }
})

watch(quantity, (val) => {

    if (!val || val < 1) {
        quantity.value = 1
    }
})
watch(items, (val) => {
    const result: number = val.reduce((acc, curr) => {
        return acc + curr.subTotal
    }, 0)
    display.totalAmount = result
}, {
    deep: true,
    immediate: true
})
onMounted(() => {
    getProducts()
})
</script>
