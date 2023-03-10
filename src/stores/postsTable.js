import { defineStore } from 'pinia'
import { axios } from 'boot/axios'
// import { Notify } from 'quasar'

export const useTableStore = defineStore({
  id: 'postsTable',

  state: () => ({
    tableInitial: [],
    table: []
  }),

  actions: {
    async getData () {
      try {
        const response = await axios.post('/api', { RFI: 9, token: localStorage.getItem('token') })
        if (response.data.RC === 0) {
          this.tableInitial = response.data.apks_info
          this.table = JSON.parse(JSON.stringify(this.tableInitial))
        } else if (response.data.NUM_ERR === -1 || response.data.NUM_ERR === -2) {
          console.error(response.data.__ERR)
          // ! РАЗЛОГИНИТЬ
        } else if (response.data.NUM_ERR === -3) {
          console.group('Ошибка запроса к базе данных')
          console.log(response.data.__ERR)
          console.log(response.data.message)
          console.groupEnd()
          // ! ВСПЛЫВАШКА С __ERR
        }
      } catch (err) {
        console.error(err)
        // ! СДЕЛАТЬ УЛЬТИМАТИВНУЮ ВЫВАЛИВАЛКУ С МОГИЛКОЙ
      }
    }
  }
})
