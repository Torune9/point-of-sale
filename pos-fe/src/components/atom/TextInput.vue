<template>
    <div class="flex flex-col gap-y-1">
        <label :for="label" class="font-medium capitalize">
            {{ label }}
        </label>
        <input :type="type" :name="label" :id="label" class="border border-black/50 focus:outline-primary px-2 rounded-lg py-2 hover:outline-1 hover:outline-accent transition-all duration-500" v-model="model">
        <small class="text-red-700">
            {{ errorMessage ? errorMessage[0].$message : '' }}
        </small>
    </div>
</template>

<script setup lang="ts">
import { ErrorObject } from '@vuelidate/core';

const props = withDefaults(defineProps<{
    label?: string,
    type?: 'text' | 'password',
    errorMessage?: Array<ErrorObject> | null
}>(), {
    type: 'text'
})

const model = defineModel<string>({ required: true })
</script>
