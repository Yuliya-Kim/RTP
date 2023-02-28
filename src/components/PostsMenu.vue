<template>
  <q-list v-if="postsStore.posts && postsStore.posts.conn_to_rtpnast">
    <q-item
      v-for="post in postsStore.posts.apks"
      :key="post.apk_id"
      clickable
      :to="{ path: `/posts/${post.location}` }"
      class="q-mx-md q-my-md q-py-md rounded-borders shadow-1"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
      active-class="postActive"
    >
      <q-item-section>
        <q-item-label class="text-h6">{{ post.location }}</q-item-label>
        <q-item-label caption class="flex">
          <q-icon
            :name="post.ip ? 'o_location_on' : 'o_not_listed_location'"
            style="margin-left: -2px;"
          />
          {{ post.ip || 'IP не указан' }}
        </q-item-label>
        <q-item-label>
          <!-- <q-badge
            :color="post.apk_info.info_status ? 'green' : 'transparent'"
            text-color=""
          >
          {{post.apk_info.info_status}}
          </q-badge> -->
          <br>
          <div class="row q-gutter-sm">
            <span>Состояние:</span>
            <div v-html="post.apk_info.info_status"></div>
          </div>
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
  <q-spinner-cube v-else color="cyan" size="2em" class="justify-center" />
</template>

<script setup>
// import { ref } from 'vue'
import { usePostsStore } from '../stores/posts'
const postsStore = usePostsStore()
</script>

<style scoped>
.postActive {
  /* border-left: 2px solid cyan; */
}
.postActive .card-heading {
  font-weight: 600;
}
.postActive::before {
  content: "";
  display: inline-block;
  position: relative;
  /* top: calc(-0.1 * 1em); */
  vertical-align: middle;
  height: calc(4px + 0.7em);
  margin-right: calc(5px + 0.2em);
  border-left: calc(1px + 0.1em) solid #00c7ac;
}
</style>
