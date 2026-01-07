<template>
    <DashboardSketeleton v-if="isLoading" />
    <div v-else class="grid grid-cols-1 sm:grid-cols-4 gap-4 h-full">
        <!-- HEADER -->
        <div class="sm:col-span-2">
            <h1 class="text-2xl font-semibold">Dashboard</h1>
            <p class="text-sm text-gray-500">
                Informasi terkait toko anda
            </p>
        </div>

        <!-- KPI CARDS -->
        <div class="sm:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div v-for="(value, i) in storeBusiness.dataCash" :key="Object.keys(value)[0]"
                class="text-white rounded-xl p-3 shadow-sm flex flex-col justify-between border border-black/20" :class="{
                    'bg-accent/70': i == 0,
                    'bg-red-600/70': i == 1,
                    'bg-yellow-500/70': i == 2,
                }">
                <p class="text-sm capitalize opacity-90">
                    {{ Object.keys(value)[0] }}
                </p>
                <p class="text-xl font-semibold truncate">
                    {{ convert.covertToRupiah(Object.values(value)[0] as number) }}
                </p>
            </div>
        </div>

        <!-- SALES OVERVIEW -->
        <div class="sm:col-span-4 lg:col-span-3 rounded-2xl">
            <LineChart :dataSet="dataSet" />
        </div>

        <!-- RIGHT SIDEBAR -->
        <div class="sm:col-span-4 lg:col-span-1 grid grid-rows-2 gap-4">
            <!-- MEMBERS -->
            <div class="bg-pimary rounded-2xl p-4 border border-black/20">
                <p class="font-medium mb-2">Anggota</p>
                <p class="text-sm text-gray-500">Coming soon</p>
            </div>

            <!-- PRODUCTS -->
            <div class="bg-pimary rounded-2xl p-4 border border-black/20">
                <p class="font-medium mb-2">Product</p>
                <p class="text-sm text-gray-500">Coming soon</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import LineChart from '@/components/atom/LineChart.vue'
import DashboardSketeleton from '@/components/organism/DashboardSketeleton.vue'
import { useConvert } from '@/composables/useConvert'
import { businessStore } from '@/stores/businessStore'
import { financeStore } from '@/stores/financeStore'
import { userStore } from '@/stores/userStore'
import { computed, onBeforeMount, ref } from 'vue'
const isLoading = ref<boolean>(true)

const storeBusiness = businessStore()
const storeFinance = financeStore()
const storeUser = userStore()
const convert = useConvert()

const months = ref<[]>([])
const totalDataInMonths = ref<[]>([])

const getAnnualSales = async () => {
    try {
        const response = await storeFinance.getAnnualSales(storeUser.userBusiness.id)

        months.value = response.result.data.map((val) =>
            new Date(val.month).toLocaleString('id-ID', { month: 'short' })
        )
        totalDataInMonths.value = response.result.data.map(val => val.total)

    } catch (error) {
        console.log(error);
    }
}

const dataSet = computed(() => ({
    title: 'Sales Revenue Summary',
    label: 'Monthly Income',
    labels: months.value,
    data: totalDataInMonths.value

}))

const emits = defineEmits<{
    fetchDashboardData: [isDone: boolean]
}>()

onBeforeMount(async () => {
    Promise.all([
        await storeBusiness.getTotalBusinessCash(storeUser.userBusiness.id),
        await getAnnualSales()
    ]).finally(() => {
        isLoading.value = false
    })
})

</script>
