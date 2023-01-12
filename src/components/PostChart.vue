<template>
  <div>беба</div>
</template>

<script setup>
import { defineExpose } from 'vue'
// import { apexcharts } from '../boot/apexChart'
// import ru from 'apexcharts/dist/locales/ru.json'

function getChartData () {
  alert('пипа пипа')
}

defineExpose({
  getChartData
})
</script>
