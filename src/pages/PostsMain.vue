<template>
  <q-table
    :columns="headers"
    :rows="postsTable"
    row-key="id"
    :loading="tableLoading"
    v-model:pagination="pagination"
    hide-bottom
    separator="cell"
    class="q-ma-md"
    bordered
    flat
    color="secondary"
  >
    <template v-slot:body="props">
      <q-tr :props="props" class="tbl-row">
        <!-- <q-td v-for="(col) in headers" :key="col.name" :props="props">
          <TipTapEditor
            v-model="postsTable[props.rowIndex][col.name]"
            :ref="(el) => { itemRefs[col.name].push(el) }"
          />
        </q-td> -->
        <q-td key="id" :props="props" class="vertical-top">
          <div v-html="props.row.id" class="q-py-sm" />
        </q-td>

        <q-td key="location" :props="props" class="vertical-top">
          <div v-html="props.row.location" class="q-py-sm" />
        </q-td>

        <q-td
          key="info_status" :props="props"
          @click="selectCell('info_status', props.row.rId)"
          class="no-padding vertical-top cursor-pointer"
        >
          <TipTapEditor
            v-model="props.row.info_status"
            :ref="(el) => { itemRefs.info_status.push(el) }"
          />
        </q-td>
      </q-tr>
    </template>
    <!-- <template v-slot:loading>
      <q-inner-loading showing color="yellow" />
    </template> -->
  </q-table>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { axios } from 'boot/axios'

import { useAuthStore } from '../stores/auth'
import { usePostsTableStore } from '../stores/postsTable'

import TipTapEditor from '../components/TipTapEditor.vue'

const authStore = useAuthStore()
const postsTableStore = usePostsTableStore()

const tableLoading = ref(true)
const pagination = { rowsPerPage: 0 }
const headers = [
  { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' },
  { name: 'location', label: 'Расположение', field: 'location', sortable: true, align: 'left' },
  { name: 'info_status', label: 'Состояние', field: 'info_status', sortable: true, align: 'left' },
  { name: 'info_now_state', label: 'Примечания', field: 'info_now_state', sortable: false, align: 'left' },
  { name: 'info_due_date', label: 'Планируемый срок выполнения', field: 'info_due_date', sortable: false, align: 'left' },
  { name: 'info_work_sheet', label: 'Состав работ', field: 'info_work_sheet', sortable: false, align: 'left' }
]

const { postsTable } = storeToRefs(postsTableStore)

const timer = ref(null)
const itemRefs = reactive({
  id: [],
  location: [],
  info_status: [],
  info_now_state: [],
  info_due_date: [],
  info_work_sheet: []
})

/**
 * Запрос данных о постах
 * * RFI (number) - Номер запроса - 9
 * * token (string) - Токен текущего пользователя
 */
async function getData () {
  tableLoading.value = true
  try {
    await postsTableStore.getTableData()
    tableLoading.value = false
    timer.value = setInterval(() => checkCRC(), 1000)
  } catch (err) {
    console.error(err)
    tableLoading.value = false
    // !!!
  }
}

/**
 * Проверка CRC таблицы постов
 * * RFI (number) - Номер запроса - 13
 * * token (string) - Токен текущего пользователя
 * * file_name (string) - Имя таблицы (“users” или “posts”)
 * * crc (number) - Контрольная сумма таблицы
 * * ---
 * NUM_ERR === -1: Ошибка входных параметров
 * NUM_ERR === -2: Пользователь с указанным токеном в настоящее время не существует.
 * NUM_ERR === -3: Запрашиваемая таблица не существует
 * NUM_ERR === -4: Данные были изменены
 */
async function checkCRC () {
  try {
    const response = await axios.post('/api', {
      RFI: 13,
      token: authStore.token,
      file_name: 'posts',
      crc: Number(localStorage.getItem('crcPostsTable'))
    })
    if (response.data.RC === -1) {
      if (response.data.NUM_ERR === -1 || response.data.NUM_ERR === -2) {
        console.error(response.data.__ERR)
        // !!! РАЗЛОГИНИТЬ
      } else if (response.data.NUM_ERR === -3) {
        console.log(response.data.__ERR)
      } else if (response.data.NUM_ERR === -4) {
        timer.value = clearInterval(timer.value)
        // ! ВСПЛЫВАШКА О ТОМ, ЧТО ДАННЫЕ ИЗМЕНИЛИСЬ И НАДО ОБНОВИТЬ ТАБЛИЦУ
      }
    }
  } catch (error) {
    timer.value = clearInterval(timer.value)
    console.error('!!!!!' + error)
    // !!! СДЕЛАТЬ УЛЬТИМАТИВНУЮ ВЫВАЛИВАЛКУ С МОГИЛКОЙ
  }
}

onMounted(() => {
  getData()
})
onBeforeUnmount(() => {
  // timer.value = clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.tbl-row :focus-visible {
  outline: none;
}

.selectedCell {
  box-shadow: inset 0px 0px 0px 1px $primary;
}
</style>
