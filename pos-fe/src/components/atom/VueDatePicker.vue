<template>
    <VueDatePicker v-model="date" placeholder="Select Date"></VueDatePicker>
</template>

<script setup>
import { ref } from 'vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref();
</script>
