import { defineStore } from 'pinia'
import { axios } from 'boot/axios'
import { reactive } from 'vue'
// import { Notify } from 'quasar'

export const usePostsTableStore = defineStore('postsTableData', {
  state: () => ({
    postsTable: reactive([])
    // posts: JSON.parse(localStorage.getItem('posts'))
    // currentPost: JSON.parse(localStorage.getItem('currentPost'))
  }),

  // getters: {
  //   currentDateWeek (state) {
  //     return date.formatDate(date.subtractFromDate(state.currentDate, { days: 7 }), 'YYYY-MM-DD HH:mm:ss')
  //   }
  // },

  actions: {
    /**
     * Запрос данных о постах
     * * RFI (number) - Номер запроса - 9
     * * token (string) - Токен текущего пользователя
     * NUM_ERR === -1: Ошибка входных параметров
     * NUM_ERR === -2: Пользователь с указанным токеном в настоящее время не существует.
     * NUM_ERR === -3: Ошибка запроса к базе данных
     */
    async getTableData () {
      try {
        console.log('1')
        const response = await axios.post('/api', { RFI: 9, token: localStorage.getItem('token') })
        if (response.data.RC === 0) {
          this.postsTable = response.data.apks_info.map((post, i) => ({ rId: i, ...post }))
          localStorage.setItem('crcPostsTable', response.data.crc)
        } else if (response.data.NUM_ERR === -1 || response.data.NUM_ERR === -2) {
          console.error(response.data.__ERR)
          // !!! РАЗЛОГИНИТЬ
        } else if (response.data.NUM_ERR === -3) {
          console.group('Ошибка запроса к базе данных')
          console.log(response.data.__ERR)
          console.log(response.data.message)
          console.groupEnd()
          // !!! ВСПЛЫВАШКА С __ERR
        }
        console.log('2')
      } catch (err) {
        console.error(err)
        // !!! СДЕЛАТЬ УЛЬТИМАТИВНУЮ ВЫВАЛИВАЛКУ С МОГИЛКОЙ
      }
    }

  }
})
