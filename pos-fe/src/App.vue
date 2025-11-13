<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import MinimalLayout from '@/layouts/MinimalLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import EmptyLayout from './layouts/EmptyLayout.vue'

const route = useRoute()

const layout = computed(() => {
  switch (route.meta.layout) {
    case 'auth':
      return AuthLayout
    case 'main':
      return MainLayout
    case 'empty':
      return EmptyLayout
    default:
      return MinimalLayout
  }
})
</script>
