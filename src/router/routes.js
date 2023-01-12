import { usePostsStore } from '../stores/posts'

const routes = [
  {
    path: '/',
    redirect: '/posts'
  },
  {
    path: '/posts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PostsMain.vue')
      }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/posts/:location',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PostPage.vue')
      }
    ],
    meta: {
      requiresAuth: true
    },
    beforeEnter: (to, from, next) => {
      const store = usePostsStore()
      store.getCurrentPost(to.params.location)
      if (store.currentPost) {
        next()
      } else {
        next({ path: '/posts' })
      }
    }
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    meta: {
      title: 'Вход',
      requiresAuth: false
    }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
