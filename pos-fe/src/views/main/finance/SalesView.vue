<template>
    <div class="flex flex-col gap-y-2">
        <div class="inline-flex gap-x-4 justify-between items-center w-full">
            <div>

                <VueDatePicker v-model="date" range />
            </div>
            <div>
                <Transition name="fade" mode="out-in">
                    <BaseButton v-if="!isReport" @click="showOrHideReport">
                        <template #title-btn>
                            Report
                        </template>
                    </BaseButton>
                    <form v-else @submit.prevent="report"
                        class="flex flex-col gap-y-2 fixed right-2 bottom-2 z-30 bg-white p-2 outline outline-black/30 rounded-md shadow-md">
                        <div class="flex flex-row justify-between">
                            <Title tag="h3">Report Selling</Title>
                            <button
                                class="h-6 w-6 rounded-full bg-red-600 hover:bg-red-500 transition-colors cursor-pointer text-white">
                                <Icon icon="heroicons:x-mark-16-solid" class="m-auto" @click.stop="showOrHideReport" />
                            </button>
                        </div>
                        <div>
                            <small for="start">Start date</small>
                            <VueDatePicker v-model="queryDate.startDate" />
                        </div>
                        <div>
                            <small for="start">End date</small>
                            <VueDatePicker v-model="queryDate.endDate" />
                        </div>
                        <BaseButton type="submit" :is-disable="isLoading">
                            <template #title-btn>
                                Submit
                            </template>
                        </BaseButton>
                    </form>
                </Transition>
            </div>
        </div>
        <div class="capitalize">
            <EasyTable :headers="headers" :items="items" alternating border-cell table-class-name="customize-table"
                :rows-per-page="10" :rows-items="[10, 15, 20]" :loading="loading">
                <template #item-paidAmount="{ paidAmount }">
                    {{ convert.covertToRupiah(paidAmount) }}
                </template>
                <template #item-totalAmount="{ totalAmount }">
                    {{ convert.covertToRupiah(totalAmount) }}
                </template>
                <template #item-changeAmount="{ changeAmount }">
                    {{ convert.covertToRupiah(changeAmount) }}
                </template>
                <template #item-createdAt="{ createdAt }">
                    {{ convert.convertToLocalDate(createdAt) }}
                </template>
            </EasyTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atom/BaseButton.vue';
import VueDatePicker from '@/components/atom/VueDatePicker.vue';
import { useConvert } from '@/composables/useConvert';
import { financeStore } from '@/stores/financeStore';
import { userStore } from '@/stores/userStore';
import { onMounted, reactive, ref, watch } from 'vue';
import { Header, Item } from 'vue3-easy-data-table';
import Title from '@/components/atom/Title.vue';

const storeFinance = financeStore()
const storeUser = userStore()

const convert = useConvert()
const isLoading = ref<boolean>(false)
const loading = ref<boolean>(false)

const headers = ref<Header[]>([
    {
        text: "invoice",
        value: "invoice"
    },
    {
        text: "total amount",
        value: "totalAmount"
    },
    {
        text: "paid amount",
        value: "paidAmount"
    },
    {
        text: "change amount",
        value: "changeAmount"
    },
    {
        text: "Date",
        value: "createdAt"
    },
])

const date = ref([])

const queryDate = reactive({
    startDate: '',
    endDate: ''
})

const items = ref<Item[]>([{

}])

const isReport = ref<boolean>(false)
const showOrHideReport = () => isReport.value = !isReport.value

const getSales = async (query: any = {}) => {
    loading.value = true
    try {
        const response = await storeFinance.getSales(storeUser.userBusiness.id, query)
        items.value = response.result.data
    } finally {
        loading.value = false
    }
}
const report = async () => {
    isLoading.value = true
    try {
        await storeFinance.createReport(storeUser.userBusiness.id, queryDate)
    } finally {
        isLoading.value = false
        isReport.value = false
    }

}

watch(date, (val) => {
    if (val) {
        const [startDate, endDate] = [new Date(val[0]).toDateString(), new Date(val[1]).toDateString()]
        const query = { startDate, endDate }
        getSales(query)
    } else {
        getSales()
    }
}, {
    deep: true
})

onMounted(() => {
    getSales()
})
</script>
