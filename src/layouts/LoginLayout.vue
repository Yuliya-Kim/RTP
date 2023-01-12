<template>
  <q-layout view="hHh lpR fFf" class="">
    <q-page-container class="">
      <q-page class="flex column justify-center items-center">

        <div class="flex column q-gutter-y-md">
          <div class="flex no-wrap q-gutter-md">
            <q-img width="40px" fit="fill" src="../assets/logo.svg"></q-img>
            <div class="flex column">
              <span>НИИ СТТ</span>
              <span class="text-caption">Система мониторинга постов РТМ</span>
            </div>
          </div>

          <q-card style="width: 360px; height: fit-content;">

            <q-card-section class="text-h5 bullet">
              Вход в систему
            </q-card-section>

            <q-card-section>
              <q-form
                @submit.prevent="onSubmit"
                @reset="onReset"
                class="q-gutter-md"
              >
                <q-input
                  filled
                  v-model="email"
                  label="E-mail"
                  lazy-rules
                />

                <q-input
                  filled
                  type="password"
                  v-model="password"
                  label="Пароль"
                  lazy-rules
                  :rules="[
                    val => val !== null && val !== '' || 'Надо написать пароль!!'
                  ]"
                />

                <div class="">
                  <q-btn label="Очистить" type="reset" color="primary" flat class="q-ml-sm" />
                  <q-btn label="Войти" type="submit" color="primary"/>
                </div>

              </q-form>
            </q-card-section>
          </q-card>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>

import { ref } from 'vue'
// import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

// const $q = useQuasar()
const authStore = useAuthStore()
const email = ref('kim.uo@niistt.ru')
const password = ref('bebra123')

const router = useRouter()

async function onSubmit () {
  await authStore.login(email.value, password.value)
  await authStore.checkAuth()
  router.push('/posts')
}

function onReset () {
  email.value = null
  password.value = null
}

</script>
