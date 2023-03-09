<template>
  <PostsTableToolbar
    :selectedCell = selectedCell
    :itemRefs = itemRefs
  />
  <q-table
    :loading="tableLoading"
    :columns="headers"
    :rows="posts"
    row-key="id"
    hide-bottom
    v-model:pagination="pagination"
    separator="cell"
    class="posts-table q-ma-md"
    color="secondary"
    bordered
    flat
  >
    <template v-slot:body="props">
      <q-tr :props="props" class="posts-table__tr" >
        <q-td
          v-for="(col) in headers" :key="col.name" :props="props"
          @click="selectCell(col.name, props.rowIndex)"
          class="posts-table_td no-padding vertical-top cursor-pointer"
        >
          <TipTapEditor
            v-model="props.row[col.name]"
            :ref="(el) => { itemRefs[col.name].push(el) }"
            :key="props.row.id"
            :editable="col.name === 'id' || col.name ==='location' ? false : true"
            :activeCell="isCellActive(col.name, props.rowIndex)"
            :selectedCell = "selectedCell"
            @saveCell='saveCell(props.row[col.name], col.name, props.row.location, props.rowIndex)'
            :class="{ 'selectedCell': isCellActive(col.name, props.rowIndex) }"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>{{posts}}
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
// import { notifyPositive } from 'boot/myNotify'
import { axios } from 'boot/axios'

import { useAuthStore } from '../stores/auth'

import PostsTableToolbar from '../components/PostsTable__toolbar.vue'
import TipTapEditor from '../components/TipTapEditor.vue'

const $q = useQuasar()
const authStore = useAuthStore()

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
const posts = ref([])
const postsInitial = ref([])

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
 * NUM_ERR === -1: Ошибка входных параметров
 * NUM_ERR === -2: Пользователь с указанным токеном в настоящее время не существует
 * NUM_ERR === -3: Ошибка запроса к базе данных
 */
async function getTableData () {
  tableLoading.value = true
  try {
    const response = await axios.post('/api', { RFI: 9, token: authStore.token })
    if (response.data.RC === 0) {
      console.log('prprprprprp')
      posts.value = response.data.apks_info
      postsInitial.value = response.data.apks_info

      tableLoading.value = false
      localStorage.setItem('crcPosts', response.data.crc)
      timer.value = setInterval(() => checkCRC(), 1000)
    } else if (response.data.NUM_ERR === -1 || response.data.NUM_ERR === -2) {
      console.error(response.data.__ERR)
      // ! РАЗЛОГИНИТЬ
    } else if (response.data.NUM_ERR === -3) {
      console.group('Ошибка запроса к базе данных')
      console.log(response.data.__ERR)
      console.log(response.data.message)
      console.groupEnd()
      // ! ВСПЛЫВАШКА С __ERR
    }
  } catch (err) {
    console.error(err)
    // ! СДЕЛАТЬ УЛЬТИМАТИВНУЮ ВЫВАЛИВАЛКУ С МОГИЛКОЙ
  }
}

/**
 * Проверка CRC таблицы постов
 * * RFI (number) - Номер запроса - 13
 * * token (string) - Токен текущего пользователя
 * * file_name (string) - Имя таблицы (“users” или “posts”)
 * * crc (number) - Контрольная сумма таблицы
 * NUM_ERR === -1: Ошибка входных параметров
 * NUM_ERR === -2: Пользователь с указанным токеном в настоящее время не существует
 * NUM_ERR === -3: Ошибка запроса к базе данных, запрашиваемая таблица не существует
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
    console.error('!!checkCRC!!' + error)
    // !!! СДЕЛАТЬ УЛЬТИМАТИВНУЮ ВЫВАЛИВАЛКУ С МОГИЛКОЙ
  }
}

const selectedCell = reactive({
  colName: '',
  rowId: null
})

/**
 * Установить активную ячейку
 * @param {string} col - Наименование столбца выбранной ячейки
 * @param {number} row - Номер строки выбранной ячейки
 */
function selectCell (col, row) {
  selectedCell.colName = col
  selectedCell.rowId = row
}

/**
 * Проверяет, является ли ячейка активной
 * @param {string} c - Наименование столбца проверяемой ячейки
 * @param {number} r - Номер строки проверяемой ячейки
 */
function isCellActive (c, r) {
  return c === selectedCell.colName && r === selectedCell.rowId
}

/**
 * Редактирование информации о посте
 * @param {string} value - Новое значение редактируемого поля
 * @param {string} field_name - Название редактируемого поля: "info_now_state", "info_work_sheet", "info_status"
 * @param {string} location - Расположение поста
 * RFI (number) - Номер запроса - 12
 * token (string) - Токен текущего пользователя
 */
async function saveCell (value, fieldName, location, rowID) {
  console.log(fieldName, rowID)
  itemRefs[fieldName][rowID].btnLoading = true
  try {
    const response = await axios.post('/api', {
      RFI: 12,
      token: authStore.token,
      location,
      field_name: fieldName,
      value
    })
    if (response.data.RC === 0) {
      // itemRefs[selectedCell.colName][selectedCell.rowId].initialValue = value // !!!!!!!!
      itemRefs[fieldName][rowID].btnLoading = false
      $q.notify({ type: 'notifyPositive', message: `Данные РТП "${location}" обновлены` })
      getTableData()
    } else if (response.data.NUM_ERR === -1 || response.data.NUM_ERR === -2) {
      console.error(response.data.__ERR)
      // !!! РАЗЛОГИНИТЬ
    } else if (response.data.NUM_ERR === -3) {
      console.group('Ошибка запроса к базе данных')
      console.log(response.data.__ERR)
      console.log(response.data.message)
      console.groupEnd()
      itemRefs[fieldName][rowID].btnLoading = false
      $q.notify({
        type: 'notifyNegative',
        message: response.data.__ERR
      })
    }
  } catch (error) {
    console.error(error)
    // !!! СДЕЛАТЬ УЛЬТИМАТИВНУЮ ВЫВАЛИВАЛКУ С МОГИЛКОЙ
  }
}

onMounted(() => {
  getTableData()
})
onBeforeUnmount(() => {
  timer.value = clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.posts-table {
  max-height: 100vh;
  .posts-table__tr {
    height: 100%;
  }
  .posts-table_td {
    height: 100%;
  }
}

.posts-table__tr :focus-visible {
  outline: none;
}

.selectedCell {
  box-shadow: inset 0px 0px 0px 1px $primary;
}
</style>
