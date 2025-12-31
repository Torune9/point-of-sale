<template>
  <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 h-full animate-pulse">

    <!-- HEADER -->
    <div class="sm:col-span-2 space-y-2">
      <div class="h-6 w-40 bg-gray-300 rounded"></div>
      <div class="h-4 w-60 bg-gray-200 rounded"></div>
    </div>

    <!-- KPI CARDS -->
    <div class="sm:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-gray-200 rounded-xl p-3 h-20 flex flex-col justify-between"
      >
        <div class="h-3 w-20 bg-gray-300 rounded"></div>
        <div class="h-5 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>

    <!-- SALES OVERVIEW -->
    <div class="sm:col-span-4 lg:col-span-3 bg-gray-200 rounded-2xl p-4 h-64">
      <div class="h-4 w-32 bg-gray-300 rounded mb-4"></div>
      <div class="h-[85%] bg-gray-300 rounded"></div>
    </div>

    <!-- RIGHT SIDEBAR -->
    <div class="sm:col-span-4 lg:col-span-1 grid grid-rows-2 gap-4">
      <div class="bg-gray-200 rounded-2xl p-4 h-28"></div>
      <div class="bg-gray-200 rounded-2xl p-4 h-28"></div>
    </div>

  </div>
</template>
