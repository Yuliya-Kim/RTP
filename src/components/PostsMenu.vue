<template>
  <q-list v-if="postsStore.posts">
    <q-item
      v-for="post in postsStore.posts.apks"
      :key="post.apk_id"
      clickable
      :to="{ path: `/posts/${post.location}` }"
      class="q-mx-md q-my-md q-py-md rounded-borders shadow-1"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    >
      <q-item-section>
        <q-item-label>{{ post.location }}</q-item-label>
        <q-item-label caption class="flex">
          <q-icon
            :name="post.ip ? 'o_location_on' : 'o_not_listed_location'"
            style="margin-left: -2px;"
          />
          {{ post.ip || 'IP не указан' }}
        </q-item-label>
        <q-item-label>
          <q-badge
            :color="post.apk_info.info_status ? 'green' : 'transparent'"
            text-color=""
          >
          {{post.apk_info.info_status}}
          </q-badge>
        </q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-icon
          :name="post.connection ? 'mdi-signal' : 'mdi-signal-off'"
          :color="post.connection ? 'green-13' : 'red'"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
// import { ref } from 'vue'
import { usePostsStore } from '../stores/posts'
const postsStore = usePostsStore()
</script>
