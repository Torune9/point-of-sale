<template>
    <div class="flex flex-col w-full">
        <label :for="label" class="font-medium capitalize max-sm:text-sm mb-2">
            {{ label }}
        </label>
        <input type="text" :name="label" :id="label"
            class="w-full border border-black/20 focus:outline-primary p-2 rounded-lg hover:outline-1 hover:outline-accent transition-all duration-500"
            v-model="displayValue" :placeholder="placeholder" :disabled="disabled" :autocomplete="autoComplete" :class="{
                'bg-gray-300': disabled
            }">
        <small class="text-red-700">
            {{ errorMessage ? errorMessage[0].$message : '' }}
        </small>
    </div>
</template>

<script setup lang="ts">
import { ErrorObject } from '@vuelidate/core';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    label?: string,
    errorMessage?: Array<ErrorObject> | null,
    placeholder?: string,
    disabled?: boolean,
    autoComplete?: string
}>(), {
    disabled: false,
    autoComplete: 'on'
})

const model = defineModel<string>({ required: true })
const emits = defineEmits<{
    onInputUpdate: [string | number]
}>()

const displayValue = computed({
    get() {
        if (!model.value) return ''
        const onlyNumber = model.value.replace(/\D/g, '')
        return Number(onlyNumber).toLocaleString('id-ID')
    },
    set(val: string) {
        const onlyNumber = val.replace(/\D/g, '')
        emits('onInputUpdate', onlyNumber)
        model.value = onlyNumber
    }
})

</script>
