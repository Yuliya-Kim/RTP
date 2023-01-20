<template>
  <q-page padding>
    <div v-if="post" class="text-h5">{{post.location}}</div>

    <q-form @submit.prevent="getChartData()" class="flex q-gutter-md">
      <q-input v-model="chartDate[0]" filled dense>
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="chartDate[0]" mask="YYYY-MM-DD HH:mm:ss">
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
              <q-time v-model="chartDate[0]" mask="YYYY-MM-DD HH:mm:ss" format24h>
                <div class="row items-center justify-end">
                  <!-- <q-btn v-close-popup label="Close" color="primary" flat /> -->
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input v-model="chartDate[1]" filled  dense>
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="chartDate[1]" mask="YYYY-MM-DD HH:mm:ss">
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
              <q-time v-model="chartDate[1]" mask="YYYY-MM-DD HH:mm:ss" format24h>
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

    <q-card class="q-py-md q-px-lg">
      <VChart
        ref="postChart"
        :init-options="initOptions"
        :option="option"
        :loading="chartIsLoading"
        :loading-options="{ text: '', maskColor: 'rgba(255, 255, 255, 0)', lineWidth: 2 }"
        autoresize
        class="chart"
      />
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'

import { axios } from 'boot/axios'
import { useQuasar, date } from 'quasar'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
// import { SVGRenderer } from 'echarts/renderers'
import { LineChart, BarChart, CustomChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components'
import 'echarts/theme/dark2'
import VChart, { THEME_KEY } from 'vue-echarts'
// import VChart from 'vue-echarts'

import 'echarts/i18n/langRU'

const authStore = useAuthStore()
const postsStore = usePostsStore()

const post = computed(() => postsStore.currentPost)

use([
  CanvasRenderer,
  // SVGRenderer,
  LineChart,
  BarChart,
  CustomChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  DataZoomComponent,
  ToolboxComponent
])

provide(THEME_KEY, 'dark2')

const postChart = ref(null)
const chartIsLoading = ref(true)

const initOptions = {
  locale: 'RU'
}

const option = ref({
  series: [],
  legend: {
    data: []
  },
  grid: [
    {
      left: 0,
      right: 0
    }
  ],
  xAxis: [
    {
      type: 'time',
      axisLabel: {
        formatter: {
          year: '{yyyy}',
          month: '{MMM}',
          day: '{d} {MMM}',
          hour: '{HH}:{mm}',
          minute: '{HH}:{mm}',
          second: '{HH}:{mm}:{ss}',
          millisecond: '{hh}:{mm}:{ss} {SSS}',
          none: '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss} {SSS}'
        }
      }
    }
  ],
  yAxis: [
    {
      show: false,
      type: 'value'
    }
  ],
  axisPointer: {
    type: 'line'
  },
  dataZoom: [
    {
      type: 'inside',
      filterMode: 'none'
    }
    // {
    //   type: 'slider',
    //   filterMode: 'none',
    //   dataBackground: {
    //     areaStyle: { opacity: 0 },
    //     lineStyle: { opacity: 0 }
    //   },
    //   selectedDataBackground: {
    //     areaStyle: { opacity: 0 },
    //     lineStyle: { opacity: 0 }
    //   },
    //   fillerColor: 'rgba(47,69,84, 1)',
    //   brushSelect: false
    // }
  ],
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      dataView: {},
      restore: {}
    }
  }
})

// const rangeBarData = ref([])

const chartDate = ref([
  date.formatDate(date.subtractFromDate(new Date(), { days: 7 }), 'YYYY-MM-DD HH:mm:ss'),
  date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
])

const $q = useQuasar()

async function getChartData () {
  chartIsLoading.value = true
  try {
    const response = await axios.post('/api', {
      RFI: 14,
      token: authStore.token,
      id: postsStore.currentPost.apk_id,
      begin_date: chartDate.value[0],
      end_date: chartDate.value[1]
    })
    if (response.data.RC === 0) {
      const arr = response.data.statistics

      const newSeries = []
      const newLegend = []

      let connectionStatus, legendName
      let barColor, barPattern, barPatternDashX, barPatternDashY

      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1].conn_to_db === '-1') {
          connectionStatus = 'НЕИЗВЕСТНА'
          legendName = 'Связь неизвестна: сервер не работал'
          barPattern = 'rect'
          barColor = 'rgba(255, 0, 0, 0)'
          barPatternDashX = [[8, 4]]
          barPatternDashY = [2, 8]
        } else {
          if (arr[i].conn_to_db === '0') {
            connectionStatus = 'НЕИЗВЕСТНА'
            legendName = 'Связь неизвестна: не было связи с БД'
            barPattern = 'rect'
            barColor = 'rgba(255, 0, 0, 0)'
            barPatternDashX = [2, 2]
            barPatternDashY = [2, 2]
          } else {
            connectionStatus = 'Всё хорошо'
            if (arr[i].connection === 't') {
              connectionStatus = 'АКТИВНА'
              legendName = 'Связь активна'
              barPattern = 'none'
              barColor = '#00A19D'
            } else if (arr[i].connection === 'f') {
              connectionStatus = 'НЕАКТИВНА'
              legendName = 'Связь неактивна'
              barPattern = 'none'
              barColor = '#E05D5D'
            }
          }
        }
        //
        const dataObject = [{
          name: legendName,
          value: [
            arr[i].date_of_change,
            arr[i + 1].date_of_change,
            connectionStatus,
            legendName
          ],
          itemStyle: {
            color: barColor,
            decal: {
              symbol: barPattern,
              color: '#797979',
              dashArrayX: barPatternDashX,
              dashArrayY: barPatternDashY
            }
          }
        }]
        //
        newSeries.push({
          name: legendName,
          type: 'custom',
          data: dataObject,
          clip: false,
          renderItem: function (params, api) {
            const start = api.coord([api.value(0), 1])
            const size = api.size([api.value(1) - api.value(0), 1])
            return {
              type: 'rect',
              transition: ['shape'],
              shape: {
                x: start[0],
                y: start[1],
                width: size[0],
                height: size[1]
              },
              style: {
                fill: api.visual('color'),
                decal: api.visual('decal')
              }
            }
          },
          encode: {
            x: [0, 1, 2, 3]
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params, ticket, callback) {
              const connectionTextColor = params.value[2] === 'АКТИВНА' ? 'text-green' : params.value[2] === 'НЕАКТИВНА' ? 'text-pink' : 'text-grey-8'
              const noConnectionReason = params.value[2] === 'НЕИЗВЕСТНА' ? params.value[params.encode.x[3]] : ''

              const startDate = date.formatDate(params.value[0], 'DD MMM, HH:mm:ss')
              const endDate = date.formatDate(params.value[1], 'DD MMM, HH:mm:ss')

              const difference = new Date(params.value[1]) - new Date(params.value[0])
              const durationDay = Math.trunc((difference / ((1000 * 3600))) / 24)
              const duration = new Date(difference - 10800000)

              const durationHours = duration.getHours()
              const durationMinutes = duration.getMinutes()
              const durationSeconds = duration.getSeconds()

              let formattedDuration = ''
              if (durationDay === 0) {
                if (durationHours === 0) {
                  if (durationMinutes !== 0 && durationSeconds !== 0) {
                    formattedDuration = durationMinutes + 'м' + ' ' + durationSeconds + 'c'
                  }
                  if (durationMinutes !== 0 && durationSeconds === 0) {
                    formattedDuration = durationMinutes + 'м'
                  }
                  if (durationMinutes === 0 && durationSeconds !== 0) {
                    formattedDuration = durationSeconds + 'c'
                  }
                } else if (durationHours !== 0) {
                  if (durationMinutes === 0 && durationSeconds === 0) {
                    formattedDuration = durationHours + 'ч'
                  }
                  if (durationMinutes !== 0 && durationSeconds === 0) {
                    formattedDuration = durationHours + 'ч' + ' ' + durationMinutes + 'м'
                  }
                  if (durationMinutes === 0 && durationSeconds !== 0) {
                    formattedDuration = durationHours + 'ч' + ' ' + durationSeconds + 'с'
                  }
                  if (durationMinutes !== 0 && durationSeconds !== 0) {
                    formattedDuration = durationHours + 'ч' + ' ' + durationMinutes + 'м' + ' ' + durationSeconds + 'с'
                  }
                }
              } else if (durationDay !== 0) {
                if (durationHours === 0) {
                  if (durationMinutes !== 0 && durationSeconds !== 0) {
                    formattedDuration = durationDay + 'д' + ' ' + durationMinutes + 'м' + ' ' + durationSeconds + 'c'
                  }
                  if (durationMinutes !== 0 && durationSeconds === 0) {
                    formattedDuration = durationDay + 'д' + ' ' + durationMinutes + 'м'
                  }
                  if (durationMinutes === 0 && durationSeconds !== 0) {
                    formattedDuration = durationDay + 'д' + ' ' + durationSeconds + 'c'
                  }
                } else if (durationHours !== 0) {
                  if (durationMinutes === 0 && durationSeconds === 0) {
                    formattedDuration = durationDay + 'д' + ' ' + durationHours + 'ч'
                  }
                  if (durationMinutes !== 0 && durationSeconds === 0) {
                    formattedDuration = durationDay + 'д' + ' ' + durationHours + 'ч' + ' ' + durationMinutes + 'м'
                  }
                  if (durationMinutes === 0 && durationSeconds !== 0) {
                    formattedDuration = durationDay + 'д' + ' ' + durationHours + 'ч' + ' ' + durationSeconds + 'с'
                  }
                  if (durationMinutes !== 0 && durationSeconds !== 0) {
                    formattedDuration = durationDay + 'д' + ' ' + durationHours + 'ч' + ' ' + durationMinutes + 'м' + ' ' + durationSeconds + 'с'
                  }
                }
              }
              return `
              <div>
                <div>
                  <span>Связь: </span>
                  <span class="text-weight-bold ${connectionTextColor}">${params.value[2]}</span>
                </div>
                <div>
                  <div style="line-height: 100%; border-left: 3px solid Tomato " class="q-pl-xs">${noConnectionReason}</div>
                </div>
                <hr size="1" color="lightgrey" noshade>
                <div class="flex justify-between">
                  <span>Начало периода: </span>
                  <span>${startDate}</span>
                </div>
                <div class="flex justify-between">
                  <span>Конец периода: </span>
                  <span>${endDate}</span>
                </div>
                <div>
                  <span>Продолжительность: </span>
                  <span>${formattedDuration}</span>
                </div>
              </div>
              `
            },
            textStyle: {
              fontFamily: 'sans-serif'
            }
          }
        })
        //
        newLegend.push({
          name: legendName,
          itemStyle: {
            decal: {
              symbol: barPattern,
              color: '#797979',
              dashArrayX: barPatternDashX,
              dashArrayY: barPatternDashY
            }
          },
          textStyle: {
            backgroundColor: 'blue'
          }
        })
      }

      postChart.value.setOption(
        {
          title: { text: 'Состояние связи с РТП' },
          legend: {
            data: newLegend,
            top: 30,
            left: 0
          },
          series: newSeries
        },
        {
          replaceMerge: ['legend', 'series']
        }
      )
      chartIsLoading.value = false
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
  height: 200px;
}
</style>
