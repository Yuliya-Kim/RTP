<template>
<q-scroll-area visible class="window-height">
  <PostsTableToolbar
    :selectedCell = selectedCell
    :itemRefs = itemRefs
  />

    <q-table
      :loading="loading"
      :columns="headers"
      :rows="posts"
      row-key="id"
      v-model:pagination="pagination"
      hide-bottom
      separator="cell"
      class="q-ma-md"
      bordered
      flat
    >
      <template v-slot:body="props">
        <q-tr :props="props" class="tbl-row">

          <q-td key="id" :props="props" class="vertical-top">
            <div v-html="props.row.id"></div>
          </q-td>

          <q-td key="location" :props="props" class="vertical-top">
            <div v-html="props.row.location"></div>
          </q-td>

          <q-td key="info_status" :props="props" class="vertical-top">
            <TipTapEditor
              v-model="props.row.info_status"
              :ref="(el) => { itemRefs.info_status.push(el) }"
              :selectedCell1 = "selectedCell"
              @saveCell='saveCell(props.row.info_status, props.cols[2].name, props.row.location)'
              :class="{ 'selectedCell': isCellActive('info_status', props.row.rId) }"
            />
          </q-td>

          <q-td
            key="info_now_state" :props="props"
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

          <q-td
            key="info_due_date" :props="props"
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

          <q-td
            key="info_work_sheet" :props="props"
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
  <!-- </q-card> -->
</q-scroll-area>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
// import { usePostsStore } from '../stores/posts'
import PostsTableToolbar from '../components/PostsTable__toolbar.vue'
import TipTapEditor from '../components/TipTapEditor.vue'
import { axios } from 'boot/axios'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()

const loading = ref(true)
const headers = [
  { name: 'id', label: '№', field: 'id', sortable: true, align: 'center' },
  { name: 'location', label: 'Расположение', field: 'location', sortable: true, align: 'left' },
  { name: 'info_status', label: 'Статус', field: 'info_status', sortable: true, align: 'left' },
  { name: 'info_now_state', label: 'Текущее состояние (примечания)', field: 'info_now_state', sortable: false, align: 'left' },
  { name: 'info_due_date', label: 'Планируемый срок выполнения', field: 'info_due_date', sortable: false, align: 'left' },
  { name: 'info_work_sheet', label: 'Состав работ', field: 'info_work_sheet', sortable: false, align: 'left' }
]
const posts = ref([])
const pagination = { rowsPerPage: 0 }

const timer = ref(null)
/**
 * Получение данных о постах
 */
function getTableData () {
  loading.value = true
  axios
    .post('/api', {
      RFI: 9,
      token: authStore.token
    })
    .then((response) => {
      if (response.data.RC === 0) {
        posts.value = response.data.apks_info
        for (let i = 0; i < posts.value.length; i += 1) {
          posts.value[i].rId = i
        }
        loading.value = false
        localStorage.setItem('crcPostsTable', response.data.crc)
        timer.value = setInterval(() => checkCRC(), 1000)
      } else {
        // или нет токена или ошибка сервера
      }
    })
}
/**
 * Проверка CRC таблицы постов
 */
function checkCRC () {
  axios
    .post('/api', {
      RFI: 13,
      token: authStore.token,
      file_name: 'posts',
      crc: localStorage.getItem('crcPostsTable')
    })
    .then((response) => {
      if (response.data.RC === -1) {
        timer.value = clearInterval(timer.value)
        // $q.notify({
        //   timeout: 0,
        //   position: 'top',
        //   color: 'white',
        //   textColor: 'warning',
        //   icon: 'fa-regular fa-circle-exclamation',
        //   iconColor: 'warning',
        //   classes: 'notify-warning text-weight-bold',
        //   multiLine: true,
        //   message: 'Данные таблицы были обновлены другим пользователем',
        //   actions: [
        //     { label: 'Обновить', color: 'yellow', handler: () => { getPostsData() } }
        //   ]
        // })
      }
    })
    .catch((err) => {
      timer.value = clearInterval(timer.value)
      console.error(err)
    })
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
 *
 * @param  {string} col - Наименование столбца выбранной ячейки
 * @param  {number} row - Номер строки выбранной ячейки
 */
function selectCell (col, row) {
  selectedCell.colName = col
  selectedCell.rowId = row
}
/**
 * Проверяет, является ли ячейка активной
 *
 * @param  {string} c - Наименование столбца проверяемой ячейки
 * @param  {number} r - Номер строки проверяемой ячейки
 * @return {boolean}
 */
function isCellActive (c, r) {
  return c === selectedCell.colName && r === selectedCell.rowId
}

const $q = useQuasar()
function saveCell (value, fieldName, location) {
  console.group('function saveCell (RFI=12) (っ ^.^)っ :')
  console.info('value: ' + value)
  console.log('fieldName: ' + fieldName)
  console.log('location: ' + location)
  console.groupEnd()
  itemRefs[selectedCell.colName][selectedCell.rowId].btnLoading = true
  axios.post('/api', {
    RFI: 12,
    token: authStore.token,
    location,
    field_name: fieldName,
    value
  })
    .then((response) => {
      if (response.data.RC === 0) {
        $q.notify({
          position: 'top',
          color: 'white',
          textColor: 'green-9',
          icon: 'fa-solid fa-circle-check',
          iconColor: 'green-9',
          classes: 'notify-positive text-weight-bold',
          message: '(っ ^.^)っ  ' + response.data.message
        })
        itemRefs[selectedCell.colName][selectedCell.rowId].initialValue = value
        getTableData()
      } else {
        // Notify.create({
        //   position: 'top-right',
        //   color: 'pink-4',
        //   textColor: 'white',
        //   icon: '',
        //   message: response.data.__ERR
        // })
      }
      // itemRefs[selectedCell.colName][selectedCell.rowId].btnLoading = false
    })
  // .catch(() => {
  //   // Notify.create({
  //   //   position: 'top-right',
  //   //   color: 'red-4',
  //   //   textColor: 'white',
  //   //   icon: 'error',
  //   //   message: 'ЧТО-ТО ОЧЕНЬ ПЛОХОЕ!'
  //   // })
  // })
}

onMounted(() => {
  getTableData()
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
