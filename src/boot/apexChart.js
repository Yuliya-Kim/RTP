import { boot } from 'quasar/wrappers'
import VueApexCharts from 'vue3-apexcharts'
const apexchart = VueApexCharts

export default boot(({ app }) => {
  app.config.globalProperties.$apexcharts = apexchart
})
export { apexchart }
