<template>
    <div class="flex flex-col w-full">
        <label :for="label" class="font-medium capitalize max-sm:text-sm mb-2">
            {{ label }}
        </label>
        <input :type="type" :name="label" :id="label" class="w-full border border-black/20 focus:outline-primary p-2 rounded-lg hover:outline-1 hover:outline-accent transition-all duration-500" v-model="model" :placeholder="placeholder" :disabled="disabled" :class="{
            'bg-gray-300' : disabled
        }">
        <small class="text-red-700">
            {{ errorMessage ? errorMessage[0].$message : '' }}
        </small>
    </div>
</template>

<script setup lang="ts">
import { ErrorObject } from '@vuelidate/core';

const props = withDefaults(defineProps<{
    label?: string,
    type?: 'text' | 'password' | 'number',
    errorMessage?: Array<ErrorObject> | null,
    placeholder? :string,
    disabled? : boolean
}>(), {
    type: 'text',
    disabled : false
})

const model = defineModel<string | number>({ required: true })
</script>
