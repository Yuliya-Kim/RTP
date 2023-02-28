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
    class="q-ma-md"
    bordered
    flat
  >
    <template v-slot:body="props">
      <q-tr :props="props" class="tbl-row">
        <!-- № -->
        <q-td key="id" :props="props" class="vertical-top">
          <div v-html="props.row.id" class="q-py-sm" />
        </q-td>
        <!-- РАСПОЛОЖЕНИЕ -->
        <q-td key="location" :props="props" class="vertical-top">
          <div v-html="props.row.location" class="q-py-sm" />
        </q-td>
        <!-- СТАТУС (СОСТОЯНИЕ) -->
        <q-td
          key="info_status"
          :props="props"
          @click="selectCell('info_status', props.row.rId)"
          class="no-padding vertical-top cursor-pointer"
        >
          <TipTapEditor
            v-model="props.row.info_status"
            :ref="(el) => { itemRefs.info_status.push(el) }"
            :activeCell="isCellActive('info_status', props.row.rId)"
            :selectedCell1 = "selectedCell"
            :charLimit = 20
            @saveCell='saveCell(props.row.info_status, props.cols[2].name, props.row.location)'
            :class="{ 'selectedCell': isCellActive('info_status', props.row.rId) }"
          />
        </q-td>
        <!-- ПРИМЕЧАНИЯ -->
        <q-td
          key="info_now_state"
          :props="props"
          @click="selectCell('info_now_state', props.row.rId)"
          class="no-padding vertical-top cursor-pointer"
        >
          <TipTapEditor
            v-model="props.row.info_now_state"
            :ref="(el) => { itemRefs.info_now_state.push(el) }"
            :selectedCell1 = "selectedCell"
            @saveCell='saveCell(props.row.info_now_state, props.cols[3].name, props.row.location)'
            :class="{ 'selectedCell': isCellActive('info_now_state', props.row.rId) }"
          />
        </q-td>
        <!-- ПЛАНИРУЕМЫЙ СРОК ВЫПОЛНЕНИЯ -->
        <q-td
          key="info_due_date"
          :props="props"
          @click="selectCell('info_due_date', props.row.rId)"
          class="no-padding vertical-top cursor-pointer"
        >
          <TipTapEditor
            v-model="props.row.info_due_date"
            :ref="(el) => { itemRefs.info_due_date.push(el) }"
            :selectedCell1 = "selectedCell"
            @saveCell='saveCell(props.row.info_due_date, props.cols[4].name, props.row.location)'
            :class="{ 'selectedCell': isCellActive('info_due_date', props.row.rId) }"
          />
        </q-td>
        <!-- СОСТАВ РАБОТ -->
        <q-td
          key="info_work_sheet"
          :props="props"
          @click="selectCell('info_work_sheet', props.row.rId)"
          class="no-padding vertical-top cursor-pointer"
        >
          <TipTapEditor
            v-model="props.row.info_work_sheet"
            :ref="(el) => { itemRefs.info_work_sheet.push(el) }"
            :selectedCell1 = "selectedCell"
            @saveCell='saveCell(props.row.info_work_sheet, props.cols[5].name, props.row.location)'
            :class="{ 'selectedCell': isCellActive('info_work_sheet', props.row.rId) }"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import { axios } from 'boot/axios'
import { useAuthStore } from '../stores/auth'
// import { notifyPositive } from 'boot/myNotify'
// import { usePostsStore } from '../stores/posts'
import PostsTableToolbar from '../components/PostsTable__toolbar.vue'
import TipTapEditor from '../components/TipTapEditor.vue'

const $q = useQuasar()
const authStore = useAuthStore()

const tableLoading = ref(true)
const pagination = { rowsPerPage: 0 }
const headers = [
  { name: 'id', label: '№', field: 'id', sortable: true, align: 'center' },
  { name: 'location', label: 'Расположение', field: 'location', sortable: true, align: 'left' },
  { name: 'info_status', label: 'Состояние', field: 'info_status', sortable: true, align: 'left' },
  { name: 'info_now_state', label: 'Примечания', field: 'info_now_state', sortable: false, align: 'left' },
  { name: 'info_due_date', label: 'Планируемый срок выполнения', field: 'info_due_date', sortable: false, align: 'left' },
  { name: 'info_work_sheet', label: 'Состав работ', field: 'info_work_sheet', sortable: false, align: 'left' }
]
const posts = ref([])

const timer = ref(null)
/**
 * Запрос данных о постах
 * * RFI (number) - Номер запроса - 9
 * * token (string) - Токен текущего пользователя
 */
async function getTableData () {
  tableLoading.value = true
  try {
    const response = await axios.post('/api', { RFI: 9, token: authStore.token })
    if (response.data.RC === 0) {
      posts.value = response.data.apks_info
      for (let i = 0; i < posts.value.length; i += 1) {
        posts.value[i].rId = i
      }
      tableLoading.value = false
      localStorage.setItem('crcPostsTable', response.data.crc)
      timer.value = setInterval(() => checkCRC(), 1000)
    } else if (response.data.NUM_ERR === -1 || response.data.NUM_ERR === -2) {
      // NUM_ERR === -1: Ошибка входных параметров.
      // NUM_ERR === -2: Пользователь с указанным токеном в настоящее время не существует.
      console.error(response.data.__ERR)
      // !!! РАЗЛОГИНИТЬ
    } else if (response.data.NUM_ERR === -3) {
      // Ошибка запроса к базе данных.
      console.group('Ошибка запроса к базе данных')
      console.log(response.data.__ERR)
      console.log(response.data.message)
      console.groupEnd()
      // !!! ВСПЛЫВАШКА С __ERR
    }
  } catch (err) {
    console.error(err)
    // !!! СДЕЛАТЬ УЛЬТИМАТИВНУЮ ВЫВАЛИВАЛКУ С МОГИЛКОЙ
  }
}

/**
 * Проверка CRC таблицы постов
 * * RFI (number) - Номер запроса - 13
 * * token (string) - Токен текущего пользователя
 * * file_name (string) - Имя таблицы (“users” или “posts”)
 * * crc (number) - Контрольная сумма таблицы
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
        // NUM_ERR === -1: Ошибка входных параметров.
        // NUM_ERR === -2: Пользователь с указанным токеном в настоящее время не существует.
        console.error(response.data.__ERR)
        // !!! РАЗЛОГИНИТЬ
      } else if (response.data.NUM_ERR === -3) {
        // Запрашиваемая таблица не существует
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

const itemRefs = reactive({
  info_status: [],
  info_now_state: [],
  info_due_date: [],
  info_work_sheet: []
})

const selectedCell = reactive({
  colName: '',
  rowId: null
})
/**
 * Установить активную ячейку
 * * col (string) - Наименование столбца выбранной ячейки
 * * row (number) - Номер строки выбранной ячейки
 */
function selectCell (col, row) {
  selectedCell.colName = col
  selectedCell.rowId = row
}
/**
 * Проверяет, является ли ячейка активной
 * * c (string) - Наименование столбца проверяемой ячейки
 * * r (number) - Номер строки проверяемой ячейки
 */
function isCellActive (c, r) {
  return c === selectedCell.colName && r === selectedCell.rowId
}
/**
 * Редактирование информации о посте
 * * RFI (number) - Номер запроса - 12
 * * token (string) - Токен текущего пользователя
 * * location (string) - Расположение поста
 * * field_name (string) - Название редактируемого поля: "info_now_state", "info_work_sheet", "info_status"
 * * value (string) - Новое значение редактируемого поля
 */
async function saveCell (value, fieldName, location) {
  console.group('Функция saveCell (RFI=12):')
  console.info('value: ' + value)
  console.log('fieldName: ' + fieldName)
  console.log('location: ' + location)
  console.groupEnd()
  //
  itemRefs[selectedCell.colName][selectedCell.rowId].btnLoading = true
  try {
    const response = await axios.post('/api', {
      RFI: 12,
      token: authStore.token,
      location,
      field_name: fieldName,
      value
    })
    if (response.data.RC === 0) {
      // itemRefs[selectedCell.colName][selectedCell.rowId].initialValue = value
      // itemRefs[selectedCell.colName][selectedCell.rowId].btnLoading = false
      $q.notify({
        type: 'notifyPositive',
        message: `Данные РТП "${location}" обновлены`
      })
      getTableData()
    } else if (response.data.NUM_ERR === -1 || response.data.NUM_ERR === -2) {
      // NUM_ERR === -1: Ошибка входных параметров.
      // NUM_ERR === -2: Пользователь с указанным токеном в настоящее время не существует.
      console.error(response.data.__ERR)
      // !!! РАЗЛОГИНИТЬ
    } else if (response.data.NUM_ERR === -3) {
      // Ошибка запроса к базе данных
      console.group('Ошибка запроса к базе данных')
      console.log(response.data.__ERR)
      console.log(response.data.message)
      console.groupEnd()
      itemRefs[selectedCell.colName][selectedCell.rowId].btnLoading = false
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
.tbl-row :focus-visible {
  outline: none;
}

.selectedCell {
  box-shadow: inset 0px 0px 0px 1px $primary;
}
</style>
