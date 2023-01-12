<template>
  <div v-if="postsStore.posts" style="padding: 0 12px;" class="flex justify-end">
    <div>
      <q-icon
        :name="postsStore.posts.conn_to_dneprdata ? 'mdi-database' : 'mdi-database-off'"
        :color="postsStore.posts.conn_to_dneprdata ? 'green' : 'red'"
        class="q-mr-xs"
      />
      <span>dneprdata</span>
    </div>
    <q-separator vertical inset spaced />
    <div>
      <q-icon
        :name="postsStore.posts.conn_to_rtplocal ? 'mdi-database' : 'mdi-database-off'"
        :color="postsStore.posts.conn_to_rtplocal ? 'green' : 'red'"
        class="q-mr-xs"
      />
      <span>rtplocal</span>
    </div>
    <q-separator vertical inset spaced />
    <div>
      <q-icon
        :name="postsStore.posts.conn_to_rtpnast ? 'mdi-database' : 'mdi-database-off'"
        :color="postsStore.posts.conn_to_rtpnast ? 'green' : 'red'"
        class="q-mr-xs"
      />
      <span>rtpnast</span>
    </div>
  </div>
</template>

<script setup>
import { usePostsStore } from '../stores/posts'
const postsStore = usePostsStore()
</script>
