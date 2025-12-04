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

                    <div class="flex flex-row border border-black/20 rounded-md hover:outline">
                        <input placeholder="search product..." type="text" id="search" v-model="search"
                            list="product-list" class="p-2 w-full focus:outline-0" autocomplete="off"/>
                        <button class="border-l-0 px-2 cursor-pointer group" @click="triggerDropdown">
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
                <TextInput label="quantity" v-model="quantity" type="number" />
                <TextInput label="price" v-model="totalPrice" :disabled="true" />
            </div>
            <div class="self-end inline-flex gap-x-2 justify-between col-span-3">
                <BaseButton type="button" @click="addToCheckoutItems">
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
                <template #item-quantity="{ id, quantity, index }">
                    <div class="inline-flex gap-x-4 relative">
                        <div class="inline-flex">
                            <button v-if="activeId == id" @click="quantityDecrement(index)"
                                class="border bg-gray-200 border-gray-300 hover:bg-gray-300 transition-colors rounded-full cursor-pointer p-1 ">
                                <icon icon="heroicons:minus-16-solid" />
                            </button>
                            <span class="mx-2">{{ quantity }}</span>
                            <button v-if="activeId == id" @click="quantityIncrement(index)"
                                class="border bg-gray-200 border-gray-300 hover:bg-gray-300 transition-colors rounded-full cursor-pointer p-1  right-full">
                                <icon icon="heroicons:plus-16-solid" />
                            </button>
                        </div>
                        <button v-if="activeId == id" @click="() => activeId = null"
                            class="border bg-green-200 border-green-400 rounded-full cursor-pointer p-1 hover:bg-green-300 transition-colors">
                            <Icon icon="heroicons:check-16-solid" />
                        </button>
                    </div>
                </template>
                <template #item-totalPrice="{ totalPrice }">
                    <span>{{ convert.covertToRupiah(totalPrice) }}</span>
                </template>
                <template #item-action="{ id }">
                    <div class="inline-flex gap-1 py-1">
                        <BaseButton size="auto" type="button" type-btn="info" @click="editQuantity(id)">
                            <template #title-btn>
                                <Icon icon="heroicons:pencil-square-20-solid" />
                            </template>
                        </BaseButton>
                        <BaseButton size="auto" type="button" type-btn="danger" @click="deleteItem(id)">
                            <template #title-btn>
                                <Icon icon="heroicons:trash-16-solid" />
                            </template>
                        </BaseButton>
                    </div>
                </template>
            </EasyTable>
        </div>
        <!-- Info transaction -->
        <div class=" row-span-3 col-span-2 bg-gray-100 p-4 rounded-2xl flex flex-col gap-y-2">
            <Title tag="h3" class="text-center">Information</Title>
            <form action="#" class="h-full flex flex-col gap-y-2">
                <TextInput :disabled="true" label="total amout" v-model="totalAmount" placeholder="0" />
                <TextInput label="paid amount" v-model="paidAmount" placeholder="0" />
                <TextInput :disabled="true" label="change amount" v-model="changeAmount" placeholder="0" />
                <BaseButton>
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
import Spinner from '@/components/atom/Spinner.vue';
import TextInput from '@/components/atom/TextInput.vue';
import Title from '@/components/atom/Title.vue';
import BarcodeScanner from '@/components/molecules/BarcodeScanner.vue';
import { useConvert } from '@/composables/useConvert';
import { useTransactionStore } from '@/stores/transactionStore';
import { CheckoutItems } from '@/types/checkoutItem';
import { storeToRefs } from 'pinia';
import { computed, nextTick, provide, reactive, ref, watch, watchEffect } from 'vue';
import { Header, Item } from 'vue3-easy-data-table';

const convert = useConvert()
const transactionStore = useTransactionStore()
const { items } = storeToRefs(transactionStore)
const {
    pushToItem,
    updateItem,
    deleteItem,
    quantityIncrement,
    quantityDecrement
} = transactionStore

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
        text: 'total price',
        value: 'totalPrice'
    },
    {
        text: 'action',
        value: 'action'
    }
])

const products = [
    {
        id: 1,
        name: 'prod 1',
        price: 1000,
    },
    {
        id: 2,
        name: 'prod 2',
        price: 2000,
    },
    {
        id: 3,
        name: 'prod 3',
        price: 3000,
    },
    {
        id: 4,
        name: 'prod 4',
        price: 8060,
    },
    {
        id: 5,
        name: 'prod 5',
        price: 3801,
    },
    {
        id: 6,
        name: 'prod 6',
        price: 3202,
    },
    {
        id: 7,
        name: 'prod 7',
        price: 2500,
    },
    {
        id: 8,
        name: 'prod 8',
        price: 7000,
    },
    {
        id: 9,
        name: 'prod 9',
        price: 15000,
    },
    {
        id: 10,
        name: 'prod 10',
        price: 10000,
    },
]

const quantity = ref<number>(1)
const paidAmount = ref<string>('')


const totalPrice = computed<number>(() => {
    if (selectedItem.value) {
        return selectedItem.value.price * quantity.value
    } else { return 0 }
})

const search = ref('')
const selectedItem = ref(null)
const isOpen = ref(false)

const triggerDropdown = () => {
    selectedItem.value = null
    search.value = ''
    isOpen.value = !isOpen.value
}

const filteredProducts = computed(() => {
    if (!search.value.trim() || isOpen.value) return products
    return products.filter(p =>
        p.name.toLowerCase().includes(search.value.toLowerCase())
    )
})

const showDropdown = computed(() => {
    if (selectedItem.value) return false
    return isOpen.value || search.value.length > 0
})

const selectItems = (item: any) => {
    selectedItem.value = item
    search.value = item.name
    isOpen.value = false
}


const addToCheckoutItems = () => {

    if (selectedItem.value) {
        const payload = {
            id: selectedItem.value.id,
            name: selectedItem.value.name,
            price: selectedItem.value.price,
            quantity: quantity.value,
            totalPrice: totalPrice.value,
        }
        const isExist = items.value.some((val) => val.id == selectedItem.value.id)
        if (isExist) {
            updateItem(selectedItem.value, quantity.value, totalPrice.value)
        } else {
            pushToItem(payload)
        }
    }

    search.value = ''
    selectedItem.value = null
    quantity.value = 1
}

const formatNumber = (n: string) => {
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
const joinCurrency = (nominal: string) => {
    return nominal.split('.').join('')
}

const totalAmount = computed(() => {
    const result = items.value.reduce((acc, curr) => {
        return acc + curr.totalPrice
    }, 0)
    return formatNumber(result.toString())
})
const changeAmount = computed(() => {
    let paid = Number(joinCurrency(paidAmount.value))

    const total = Number(joinCurrency(totalAmount.value))
    return formatNumber((Math.abs(total - paid)).toString())
})

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
        id: result.id,
        name: result.name,
        price: result.price,
        quantity: quantity.value,
        totalPrice: quantity.value * Number(result.price)
    })
}
provide('isActive', isActive)

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

watch(paidAmount, (val) => {
    paidAmount.value = formatNumber(val)
})

</script>
