<template>
  <q-page padding>
    <div v-if="post" class="text-h5">{{post.location}}</div>

    <br>

    <q-form @submit.prevent="getChartData()" class="flex q-gutter-md">
      <q-input v-model="date[0]" filled dense>
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="date[0]" mask="YYYY-MM-DD HH:mm:ss">
                <div class="row items-center justify-end">
                  <!-- <q-btn v-close-popup label="Close" color="primary" flat /> -->
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="date[0]" mask="YYYY-MM-DD HH:mm:ss" format24h>
                <div class="row items-center justify-end">
                  <!-- <q-btn v-close-popup label="Close" color="primary" flat /> -->
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input v-model="date[1]" filled  dense>
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="date[1]" mask="YYYY-MM-DD HH:mm:ss">
                <div class="row items-center justify-end">
                  <!-- <q-btn v-close-popup label="Close" color="primary" flat /> -->
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="date[1]" mask="YYYY-MM-DD HH:mm:ss" format24h>
                <div class="row items-center justify-end">
                  <!-- <q-btn v-close-popup label="Close" color="primary" flat /> -->
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-btn type="submit" flat class="text-white bg-secondary">Показать</q-btn>
    </q-form>

    <br>

    <q-card>
      <VChart ref="postChart" :option="option" :loading="chartLoading" autoresize class="chart" />
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'

import { axios } from 'boot/axios'
import { useQuasar } from 'quasar'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
// import { SVGRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components'
// import VChart, { THEME_KEY } from 'vue-echarts'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  // SVGRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  ToolboxComponent
])

// provide(THEME_KEY, 'dark')

const postChart = ref(null)
const chartLoading = ref(false)

const customData = ref([])

const option = ref({
  series: [],
  legend: {
    data: []
  },
  grid: [
    {
      left: 60,
      right: 50,
      height: '20%'
    },
    {
      left: 60,
      right: 50,
      top: '40%',
      height: '20%'
    },
    {
      left: 60,
      right: 50,
      top: '40%',
      height: '20%'
    }
  ],
  xAxis: [
    {
      type: 'time',
      // boundaryGap: false,
      axisLine: { onZero: true }
    },
    {
      gridIndex: 1,
      type: 'category',
      // boundaryGap: false,
      axisLine: { onZero: true }
    },
    {
      gridIndex: 2
    }
  ],
  yAxis: [
    {
      show: false,
      type: 'value'
    },
    {
      show: true,
      gridIndex: 1,
      type: 'category'
      // data: ['ooo']
    },
    {
      show: true,
      gridIndex: 2,
      type: 'category',
      data: ['yy']
    }
  ],
  axisPointer: {
    link: [{ xAxisIndex: 'all' }]
  },
  dataZoom: [
    {
      show: true,
      realtime: true,
      filterMode: 'none',
      xAxisIndex: [0, 1, 2]
    },
    {
      type: 'inside',
      realtime: true,
      filterMode: 'none',
      xAxisIndex: [0, 1, 2]
    }
  ],
  tooltip: {
    trigger: 'item',
    axisPointer: {
      animation: false
    }
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {}
    }
  }
})

// ////////////////////////////////////////////
const authStore = useAuthStore()
const postsStore = usePostsStore()

const post = computed(() => postsStore.currentPost)

const date = ref([formatDate((new Date() - (24 * 60 * 60 * 1000 * 7))), formatDate(new Date())])

function formatDate (date) {
  const d = new Date(date)
  //
  const year = d.getFullYear()

  let month = '' + (d.getMonth() + 1)
  month = month.length < 2 ? '0' + month : month

  let day = '' + d.getDate()
  day = day.length < 2 ? '0' + day : day

  const newDate = [year, month, day].join('-')

  //
  let hours = '' + d.getHours()
  hours = hours.length < 2 ? '0' + hours : hours

  let minutes = '' + d.getMinutes()
  minutes = minutes.length < 2 ? '0' + minutes : minutes

  let seconds = '' + d.getSeconds()
  seconds = seconds.length < 2 ? '0' + seconds : seconds

  const newTime = [hours, minutes, seconds].join(':')

  return newDate + ' ' + newTime
}

const $q = useQuasar()

async function getChartData () {
  // postChart.value.clear()
  try {
    const response = await axios.post('/api', {
      RFI: 14,
      token: authStore.token,
      id: postsStore.currentPost.apk_id,
      begin_date: date.value[0],
      end_date: date.value[1]
    })
    if (response.data.RC === 0) {
      const arr = response.data.statistics

      const newSeries = []
      const newLegend = []

      let legendName = ''

      let lineColor = ''
      let lineType = ''

      let barColor = ''
      let barPattern = ''

      for (let i = 0; i < arr.length - 1; i++) {
        const connection1 = arr[i].connection === 't' ? 1 : 0
        const connection2 = arr[i + 1].connection === 't' ? 1 : 0

        if (arr[i + 1].conn_to_db === '-1') {
          legendName = 'Сервер не работал'
          // line
          lineType = 'dashed'
          lineColor = 'grey'
          // bar
          barPattern = 'arrow'
          barColor = 'grey'
        } else {
          if (arr[i].conn_to_db === '0') {
            legendName = 'Нет связи с БД'
            // line
            lineType = 'dotted'
            lineColor = 'grey'
            // bar
            barPattern = 'circle'
            barColor = 'grey'
          } else {
            legendName = 'Всё хорошо'
            if (arr[i].connection === 't') {
              // line
              lineType = 'solid'
              lineColor = 'cyan'
              // bar
              barPattern = 'none'
              barColor = 'green'
            } else if (arr[i].connection === 'f') {
              // line
              lineType = 'solid'
              lineColor = 'red'
              // bar
              barPattern = 'none'
              barColor = 'red'
            }
          }
        }

        customData.value.push([arr[i].date_of_change, arr[i + 1].date_of_change, connection1, barColor])
        

        newLegend.push({
          name: legendName,
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: lineColor
          }
        })
        newSeries.push({
          name: legendName,
          type: 'line',
          step: 'end',
          clip: false,
          data: [[arr[i].date_of_change, connection1], [arr[i + 1].date_of_change, connection2]],
          itemStyle: {
            color: '#00e5ff'
          },
          lineStyle: {
            type: lineType,
            color: lineColor
          }
        })
        newSeries.push({
          name: legendName,
          type: 'bar',
          // stack: 'all',
          // barGap: 0,
          xAxisIndex: 1,
          yAxisIndex: 1,
          clip: false,
          data: [[arr[i].date_of_change, arr[i + 1].date_of_change], connection1],
          itemStyle: {
            color: barColor,
            decal: { symbol: barPattern }
          }
        })
        newSeries.push({
          name: legendName,
          type: 'custom',
          renderItem: renderItem,
          // stack: 'all',
          // barGap: 0,
          xAxisIndex: 2,
          yAxisIndex: 2,
          clip: false,
          data: [[arr[i].date_of_change, arr[i + 1].date_of_change], connection1],
          itemStyle: {
            color: barColor,
            decal: { symbol: barPattern }
          },
          encode: {
            x: [1, 2],
            y: 1
          },
          data: data
        })
      }

      postChart.value.setOption(
        {
          legend: {
            data: newLegend
          },
          series: newSeries
        },
        {
          replaceMerge: ['legend', 'series']
        }
      )
    } else if (response.data.NUM_ERR === -1) {
      console.error(response.data.__ERR)
    } else if (response.data.NUM_ERR === -2) {
      $q.notify({
        position: 'top',
        color: 'red-4',
        textColor: 'white',
        icon: 'error',
        message: response.data.__ERR
      })
    } else if (response.data.NUM_ERR === -3) {
      $q.notify({
        position: 'top',
        color: 'red-4',
        textColor: 'white',
        icon: 'error',
        message: response.data.__ERR,
        caption: response.data.message
      })
      console.group('Ошибка при запросе RFI=14 :')
      console.error(response.data.__ERR)
      console.error(response.data.message)
      console.groupEnd()
    } else if (response.data.NUM_ERR === -4) {
      $q.notify({
        position: 'top',
        color: 'red-4',
        textColor: 'white',
        icon: 'error',
        message: response.data.__ERR
      })
      console.group('Ошибка при запросе RFI=14 :')
      console.error(response.data.__ERR)
      console.groupEnd()
    }
  } catch (err) {
    $q.notify({
      position: 'top',
      color: 'red-4',
      textColor: 'white',
      icon: 'error',
      message: 'ЧТО-ТО ОЧЕНЬ ПЛОХОЕ! ' + err
    })
  }
}

//
onMounted(() => {
  getChartData()
})

onBeforeRouteUpdate((to, from) => {
  // if (to.params.location !== from.params.location) {
  postsStore.removeCurrentPost()
  postsStore.getCurrentPost(to.params.location)
  // }
  getChartData()
})

onBeforeRouteLeave((to, from) => {
  postsStore.removeCurrentPost()
})
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
