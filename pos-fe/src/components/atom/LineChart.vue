<template>
    <div class="rounded-xl p-4 shadow-sm border  border-black/20">
        <Line :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Filler
} from 'chart.js'
import { computed } from 'vue'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Filler
)

const props = defineProps({
    dataSet: {
        title: '',
        label: '',
        labels: [''],
        data: []
    },
})

const chartData = computed(() => ({
    labels: props.dataSet.labels,
    datasets: [
        {
            label: props.dataSet.label,
            data: props.dataSet.data,
            borderColor: '#3b82f6',          // blue-500
            backgroundColor: 'rgba(59,130,246,0.15)',
            tension: 0.4,                    // smooth line
            fill: true,                      // area chart
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#3b82f6',
            borderWidth: 2
        }
    ]
}))

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top'
        },
        tooltip: {
            mode: 'index',
            intersect: false
        },
        title: {
            display: true,
            text: props.dataSet.title
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0,0,0,0.05)'
            }
        }
    }
}))
</script>

<style scoped>
canvas {
    height: 300px !important;
}
</style>
