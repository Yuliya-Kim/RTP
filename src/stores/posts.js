import { defineStore } from 'pinia'
import { axios } from 'boot/axios'
import { Notify } from 'quasar'

export const usePostsStore = defineStore('postsData', {
  state: () => ({
    posts: JSON.parse(localStorage.getItem('posts')),
    // currentPost: JSON.parse(localStorage.getItem('currentPost'))
    currentPost: null
  }),

  getters: {
    // currentPostInfo (state) {
    //   const postId = state.currentPost.apk_id
    //   return state.posts.apks.find(post => {
    //     return post.apk_id === postId
    //   })
    // }
  },

  actions: {
    getPostsData () {
      axios
        .post('/api', { RFI: 4, token: localStorage.getItem('token') })
        .then((response) => {
          if (response.data.RC === 0) {
            this.posts = response.data
            localStorage.setItem('posts', JSON.stringify(response.data))
          } else {
            // Notify.create({
            //   position: 'top-right',
            //   color: 'pink-4',
            //   textColor: 'white',
            //   icon: '',
            //   message: response.data.__ERR
            // })
          }
        })
        .catch(() => {
          Notify.create({
            position: 'top',
            color: 'red-4',
            textColor: 'white',
            icon: 'mdi-server-off',
            message: 'К сожалению, сервер недоступен',
            caption: 'Не удалось получить данные о постах'
          })
        })
    },

    getCurrentPost (location) {
      const poopa = this.posts.apks.find(post => {
        return post.location === location
      })
      if (poopa !== undefined) {
        this.currentPost = poopa
      }
    },

    removeCurrentPost () {
      this.currentPost = null
    }
  }
})
