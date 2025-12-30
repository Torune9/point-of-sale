<template>
    <div>
        <EasyTable table-class-name="customize-table" :headers="headers" :items="items" :rows-items="[12,20]" :rows-per-page="12">
            <template #item-createdAt="{createdAt}">
                {{ convert.convertToLocalDate(createdAt) }}
            </template>
            <template #item-saleId="{saleId}">
                {{ saleId ?? '-' }}
            </template>
            <template #item-type="{type}">
                <small class="p-1 text-white rounded-md" :class="[
                    type == 'OUT' ? 'bg-red-600' : 'bg-blue-600'
                ]">
                    {{ type }}
                </small>
            </template>
        </EasyTable>
    </div>
</template>

<script setup lang="ts">
import { useConvert } from '@/composables/useConvert';
import { useTransactionStore } from '@/stores/transactionStore';
import { userStore } from '@/stores/userStore';
import { StockMovement } from '@/types/stockMovement';
import { onMounted, ref } from 'vue';
import { Header } from 'vue3-easy-data-table';
const convert = useConvert()

const storeTransction = useTransactionStore()
const storeUser = userStore()
const headers : Header[] = [
    {
        text : 'Product Name',
        value : 'product.name'
    },
    {
        text : 'Quantity',
        value : 'quantity'
    },
    {
        text : 'Type',
        value : 'type'
    },
    {
        text : 'Sales ID',
        value : 'saleId'
    },
    {
        text : 'Date',
        value : 'createdAt'
    }
]
const items = ref<StockMovement[]>([])

const getStockMovements = async () => {
    try {
        const response = await storeTransction.getStockMovement(storeUser.userBusiness.id)
        items.value = response.result.data        
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    await getStockMovements()
})
</script>
