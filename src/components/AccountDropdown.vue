<template>
  <q-btn-dropdown
    :label="userName === 'Антон Лунин' ? 'Антон 🥔' : userName"
    flat
  >
    <q-list>

      <q-item>
        <q-item-section side>
          <q-checkbox
            v-model="notify"
            @click="changeSubscription(email, 'is_notify', String(notify))"
            style="margin-left: -10px"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>Получать рассылку</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator inset />

      <q-item
        clickable
        @click="authStore.logout()"
        v-close-popup>
        <q-item-section side>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Выйти</q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const userName = ref(authStore.user.name + ' ' + authStore.user.surname)
const email = ref(authStore.user.email)
const notify = ref(authStore.user.notify)

function changeSubscription (email, field, notifyVal) {
  authStore.editUserSubscription(email, field, notifyVal)
}
</script>
