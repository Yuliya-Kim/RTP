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
      requiresAuth: true,
      pageTitle: 'Таблица'
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
      // pageTitle: 'location'
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
      requiresAuth: false,
      pageTitle: 'Вход'
    }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: {
      title: 'Вход',
      requiresAuth: false,
      pageTitle: 'Вход'
    }
  }
]

export default routes
