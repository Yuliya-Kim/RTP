import { defineStore } from 'pinia'
import { axios } from 'boot/axios'
import { Notify } from 'quasar'

export const useAuthStore = defineStore({
  id: 'auth',

  state: () => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user'))
  }),

  actions: {

    async login (email, password) {
      try {
        // alert('Func login')
        const response = await axios.post('/api', { RFI: 1, email, pass: password })
        if (response.data.RC === 0) {
          this.token = response.data.token
          localStorage.setItem('token', response.data.token)
          // alert(this.token)
        } else {
          Notify.create({
            position: 'top-right',
            color: 'pink-4',
            textColor: 'white',
            icon: '',
            message: response.data.__ERR
          })
        }
      } catch (err) {
        Notify.create({
          position: 'top-right',
          color: 'red-4',
          textColor: 'white',
          icon: 'error',
          message: 'ЧТО-ТО ОЧЕНЬ ПЛОХОЕ! ' + err
        })
      }
    },

    async checkAuth () {
      try {
        // alert('Func checkAuth')
        const response = await axios.post('/api', { RFI: 2, token: this.token })
        if (response.data.RC === 0) {
          const userData = {
            id: response.data.id,
            name: response.data.name,
            surname: response.data.surname,
            email: response.data.email,
            isAdmin: response.data.isAdmin,
            notify: response.data.notify
          }
          localStorage.setItem('user', JSON.stringify(userData))
          this.user = userData
          // alert(this.user.email)
        }
      } catch (err) {
        Notify.create({
          position: 'top-right',
          color: 'red-4',
          textColor: 'white',
          icon: 'error',
          message: 'ЧТО-ТО ОЧЕНЬ ПЛОХОЕ! ' + err
        })
      }
    },

    editUserSubscription (email, fieldName, value) {
      axios
        .post('/api', { RFI: 6, token: this.token, email, field_name: fieldName, value })
        .then((response) => {
          if (response.data.RC === 0) {
            this.checkAuth()
            Notify.create({
              position: 'top',
              color: 'green-4',
              textColor: 'white',
              icon: value === 'true' ? 'mark_email_read' : 'unsubscribe',
              message: value === 'true' ? 'Вы подписались на почтовые уведомления' : 'Вы отписались от почтовых уведомлений'
            })
          } else {
            Notify.create({
              position: 'top-right',
              color: 'pink-4',
              textColor: 'white',
              icon: '',
              message: response.data.__ERR
            })
          }
        })
        .catch(() => {
          Notify.create({
            position: 'top-right',
            color: 'red-4',
            textColor: 'white',
            icon: 'error',
            message: 'ЧТО-ТО ОЧЕНЬ ПЛОХОЕ!'
          })
        })
    },

    logout () {
      axios
        .post('/api', { RFI: 3, token: this.token })
        .then((response) => {
          if (response.data.RC === 0) {
            localStorage.removeItem('token')
            this.token = null
            localStorage.removeItem('user')
            this.user = null
            this.router.push('/login')
          } else {
            if (response.data.NUM_ERR === -1) {
              console.error('Ошибка при вызове RFI=3: ' + response.data.__ERR)
            } else if (response.data.NUM_ERR === -2) {
              Notify.create({
                position: 'top',
                color: 'red-4',
                textColor: 'white',
                icon: 'error',
                message: response.data.__ERR
              })
            }
          }
        })
    }
  }
})
