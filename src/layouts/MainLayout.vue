<template>
  <q-layout view="lHr lpR lFf">

    <q-header
      bordered
      style="border-color: rgba(255, 255, 255, 0.28);"
      class="bg-grey-10"
    >
      <q-toolbar class="bg-blue-grey-9">
        <q-toolbar-title class="text-h5">{{route.meta.pageTitle || 'РТП в городе ' + route.params.location + 'е'}}</q-toolbar-title>
        <!-- <q-toolbar-title class="text-h5">Состояние постов РТМ</q-toolbar-title> -->
        <q-btn flat icon="mdi-account-multiple" to="/users" />
        <q-separator inset vertical spaced color="white" />
        <q-toggle
          v-model="darkThemeIsActive"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          color="grey-8"
          icon-color="yellow"
          @click="changeTheme(darkThemeIsActive)"
        />
        <AccountDropdown />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      behavior="desktop"
      elevated
      class="bg-dark"
      bordered
    >
      <q-list>
        <q-item
          clickable
          dark
          style="height: 50px; border-right: 1px grey solid"
          class="bg-blue-grey-9 text-white"
          to="/posts"
        >
          <q-item-section side>
            <q-img src="../assets/logo_white.svg" width="22px" />
          </q-item-section>
          <q-item-section class="text-h6">НИИ СТТ</q-item-section>
        </q-item>
        <q-separator style="background: rgba(255, 255, 255, 0.28);" />
      </q-list>

      <q-scroll-area
        style="height: calc(100vh - 51px)"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-5'"
        visible
      >
        <PostsMenu />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark">
      <PageFooter />
    </q-footer>
  </q-layout>

</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// import { useAuthStore } from '../stores/auth'
import { usePostsStore } from '../stores/posts'
import PostsMenu from 'components/PostsMenu.vue'
import PageFooter from 'components/PageFooter.vue'
import AccountDropdown from 'components/AccountDropdown.vue'
import { useQuasar, useMeta } from 'quasar'

const route = useRoute()
// const route = useRoute()
// const location = route.params.location
const pageTitle = ref('Состояние постов РТМ')
useMeta(() => {
  return {
    title: pageTitle.value,
    titleTemplate: title => `${pageTitle.value} — Система мониторинга РТП`
  }
})

// const authStore = useAuthStore()

const postsStore = usePostsStore()
const timer = ref(null)
timer.value = setInterval(() => postsStore.getPostsData(), 1000)

const leftDrawerOpen = ref(true)

const $q = useQuasar()
const darkThemeIsActive = ref(null)

function changeTheme (v) {
  $q.dark.set(v)
  localStorage.setItem('darkTheme', $q.dark.isActive)
}

onMounted(() => {
  if (localStorage.getItem('darkTheme')) {
    const darkVal = (localStorage.getItem('darkTheme') === 'true')
    changeTheme(darkVal)
    darkThemeIsActive.value = darkVal
  } else {
    changeTheme(true)
    darkThemeIsActive.value = true
  }
})

onUnmounted(() => {
  timer.value = clearInterval(timer.value)
  localStorage.removeItem('posts')
  postsStore.posts = null
  // localStorage.removeItem('posts')
  //
})
</script>
