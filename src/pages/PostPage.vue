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
      top: 50,
      left: 0,
      bottom: 0,
      right: 0,
      height: '20%'
    },
    {
      top: '50%',
      left: 0,
      bottom: 0,
      right: 0,
      height: '15%'
    }
  ],
  xAxis: [
    {
      type: 'time',
      axisLine: { onZero: true },
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
    },
    {
      gridIndex: 1,
      type: 'time',
      // axisLine: { onZero: true },
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
    },
    {
      show: false,
      gridIndex: 1,
      type: 'value'
    }
  ],
  axisPointer: {
    type: 'line',
    link: [{ xAxisIndex: 'all' }]
  },
  dataZoom: [
    {
      type: 'inside',
      filterMode: 'none',
      xAxisIndex: [0, 1]
    },
    {
      type: 'slider',
      filterMode: 'none',
      xAxisIndex: [0, 1],
      dataBackground: {
        areaStyle: { opacity: 0 },
        lineStyle: { opacity: 0 }
      },
      selectedDataBackground: {
        areaStyle: { opacity: 0 },
        lineStyle: { opacity: 0 }
      },
      fillerColor: 'rgba(47,69,84, 1)',
      brushSelect: false
    }
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

const rangeBarData = ref([])

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

      let legendName = ''
      let lineColor = ''
      let lineType = ''
      let barColor = ''
      let barPattern = ''
      let barPatternDashX = ''
      let barPatternDashY = ''

      for (let i = 0; i < arr.length - 1; i++) {
        const conStart = arr[i].connection === 't' ? 1 : 0
        const conEnd = arr[i + 1].connection === 't' ? 1 : 0
        if (arr[i + 1].conn_to_db === '-1') {
          legendName = 'Сервер не работал'
          lineType = 'dashed'
          lineColor = 'grey'
          barPattern = 'rect'
          barColor = 'rgba(255, 0, 0, 0)'
          barPatternDashX = [[8, 4]]
          barPatternDashY = [2, 8]
        } else {
          if (arr[i].conn_to_db === '0') {
            legendName = 'Нет связи с БД'
            lineType = 'dotted'
            lineColor = 'grey'
            barPattern = 'rect'
            barColor = 'rgba(255, 0, 0, 0)'
            barPatternDashX = [2, 2]
            barPatternDashY = [2, 2]
          } else {
            legendName = 'Всё хорошо'
            if (arr[i].connection === 't') {
              lineType = 'solid'
              lineColor = '#00A19D'
              barPattern = 'none'
              barColor = '#00A19D'
            } else if (arr[i].connection === 'f') {
              lineType = 'solid'
              lineColor = '#00A19D'
              barPattern = 'none'
              barColor = '#E05D5D'
            }
          }
        }

        newSeries.push({
          name: legendName,
          type: 'line',
          data: [[arr[i].date_of_change, conStart], [arr[i + 1].date_of_change, conEnd]],
          clip: false,
          step: 'end',
          itemStyle: {
            color: '#00A19D'
          },
          lineStyle: {
            type: lineType,
            color: lineColor
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params, ticket, callback) {
              const connection = params.value[1] === 1 ? 'НОРМА' : 'ОШИБКА'
              const connectionTextColor = connection === 'НОРМА' ? 'text-green' : connection === 'ОШИБКА' ? 'text-pink' : 'text-grey-8'
              const startDate = date.formatDate(params.value[0], 'DD MMM, HH:mm:ss')
              return `
              <div>
                <div>
                  <span>Связь: </span>
                  <span class="text-weight-bold ${connectionTextColor}">${connection}</span>
                </div>
                <hr size="1" color="lightgrey" noshade>
                <div class="flex justify-between">
                  <span>Дата: </span>
                  <span>${startDate}</span>
                </div>
              </div>
              `
            },
            textStyle: {
              fontFamily: 'sans-serif'
            }
          }
        })

        rangeBarData.value.push({
          value: [
            arr[i].date_of_change,
            arr[i + 1].date_of_change,
            barColor,
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
        })

        newLegend.push({
          name: legendName,
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: lineColor
          }
        })
      }

      newSeries.push({
        name: legendName,
        type: 'custom',
        data: rangeBarData.value,
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
        dimensions: ['с', 'по', 'связь'],
        encode: {
          x: [0, 1, 2, 3]
          // y: 2,
          // tooltip: [0, 1, 2, 3, 4],
          // itemName: 4
        },
        xAxisIndex: 1,
        yAxisIndex: 1,
        tooltip: {
          trigger: 'item',
          formatter: function (params, ticket, callback) {
            const connection = params.value[2] === '#00A19D' ? 'НОРМА' : params.value[2] === '#E05D5D' ? 'ОШИБКА' : 'НЕИЗВЕСТНА'
            const connectionTextColor = connection === 'НОРМА' ? 'text-green' : connection === 'ОШИБКА' ? 'text-pink' : 'text-grey-8'

            const noConnectionReason = connection === 'НЕИЗВЕСТНА' ? params.value[params.encode.x[3]] : ''

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
                <span class="text-weight-bold ${connectionTextColor}">${connection}</span>
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
      // postChart.value.registerTheme('dark(1)', )
      postChart.value.setOption(
        {
          // legend: {
          //   data: newLegend
          // },
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
  height: 400px;
}
</style>
