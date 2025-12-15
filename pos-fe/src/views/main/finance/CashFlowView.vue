<template>
    <div class="flex flex-col gap-y-4 h-full sm:px-20 lg:p-0">
        <div class="h-full font-inter font-medium grid grid-flow-row grid-cols-[auto_1fr] gap-4">
            <div class="max-lg:col-span-2 space-y-4 lg:w-96">
                <Title tag="h1">
                    Input Cash
                </Title>
                <form @submit.prevent="recap" class="flex flex-col gap-y-4">
                    <InputCurrency label="nominal" v-model="displayAmount" @on-input-update="inputTyping"
                        :error-message="v$.displayAmount.$error ? v$.displayAmount.$errors : null" />
                    <div>
                        <label for="type">Type</label>
                        <select name="type" id="type" v-model="payload.type"
                            class="border border-black/20 p-3 rounded-lg w-full">
                            <option value="" disabled>
                                choose type
                            </option>
                            <option :value="type" v-for="(type, idx) in types" :key="idx">
                                {{ type }}
                            </option>
                        </select>
                        <small class="text-red-700" v-for="error in v$.type.$errors">
                            {{ error.$message }}
                        </small>
                    </div>
                    <TextInput label="note" v-model="payload.note" />
                    <div class="text-end">
                        <BaseButton type="submit" :is-disable="isLoading">
                            <template #title-btn>
                                <span v-if="!isLoading">Create</span>
                                <div v-else class="flex justify-center items-center">
                                    <Spinner size="xs"/>
                                </div>
                            </template>
                        </BaseButton>
                    </div>
                </form>
            </div>
            <div class="max-lg:col-span-2 space-y-2">
                <div class="flex flex-row gap-x-8">
                    <div class="flex flex-row gap-x-2 items-center">
                        <button type="button" v-for="(filter, idx) in types" :key="idx"
                            :aria-selected="activeIdx === idx" @click="selectedFilter(idx)"
                            class="bg-accent text-white hover:bg-secondary cursor-pointer rounded-md transition-all duration-300 w-14 h-max p-1"
                            :class="{
                                'hidden': activeIdx !== null && activeIdx !== idx,
                                'bg-primary': activeIdx == idx,
                            }">
                            {{ filter }}
                        </button>
                    </div>
                </div>
                <EasyTable table-class-name="customize-table" :headers="header" :items="item" :rows-per-page="10"
                    :rows-items="[10, 15, 20]" border-cell alternating>
                    <template #item-amount="{ amount }">
                        {{ convert.covertToRupiah(amount) }}
                    </template>
                    <template #item-type="{ type }">
                        <span class="block w-8 text-center text-white rounded" :class="{
                            'bg-red-600': type == 'OUT',
                            'bg-green-600': type == 'IN'
                        }">{{ type }}</span>
                    </template>
                </EasyTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atom/BaseButton.vue';

import { computed, onMounted, reactive, ref, watch } from 'vue';
import { Header, Item } from 'vue3-easy-data-table';

import { data } from '@/dummy/cashFlow';
import { useConvert } from '@/composables/useConvert';
import TextInput from '@/components/atom/TextInput.vue';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Title from '@/components/atom/Title.vue';
import { financeStore } from '@/stores/financeStore';
import { userStore } from '@/stores/userStore';
import InputCurrency from '@/components/atom/InputCurrency.vue';
import Spinner from '@/components/atom/Spinner.vue';

const storeFinance = financeStore()
const storeUser = userStore()

const convert = useConvert()

const activeIdx = ref(null)

const header = ref<Header[]>([
    {
        text: "Amount",
        value: "amount"
    },
    {
        text: "Type",
        value: "type"
    },
    {
        text: "Note",
        value: "note"
    },
    {
        text: "Date",
        value: "createdAt"
    },
])

const item = ref<Item[]>([])
const types = ref(['IN', 'OUT'])

const payload = reactive({
    amount: 0,
    type: '',
    note: ''
})

const displayAmount = ref('')

const rules = computed(() => ({
    displayAmount: { required },
    type: { required }
}))

const v$ = useVuelidate(rules, { displayAmount, type: payload.type })

const selectedFilter = (idx: number) => {
    if (activeIdx.value === idx) {
        activeIdx.value = null
        return
    }

    activeIdx.value = idx
}

const getCashFlow = async () => {
    const response = await storeFinance.getCashFlow(storeUser.userBusiness.id)
    item.value = response.result.data
}

const inputTyping = (data: string) => {
    payload.amount = Number(data)
}

const isLoading = ref<boolean>(false)

const recap = async () => {
    isLoading.value = true
    v$.value.$touch()
    const isValid = await v$.value.$validate()
    if (!isValid) return

    try {
        const response = await storeFinance.createCashFlow(storeUser.userBusiness.id, payload)
        console.log(response);

    } catch (error) {
        console.log(error);

    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    getCashFlow()
})

</script>
