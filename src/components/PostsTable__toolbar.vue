<template>
  <q-toolbar
    class="editorToolbar shadow-2"
    :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'"
  >
    <!--
    /**
    * Полужирный, курсив, подчеркнутый, зачеркнутый
    */
    -->
    <q-btn
      v-for="btn in editorBtns.fontStyle" :key="btn.id"
      :icon="btn.icon"
      @click="doEdditorAction(btn.action)"
      dense
      flat
      :class="checkActiveClass('fontStyle', btn.action)"
    >
      <q-tooltip transition-show="scale" transition-hide="scale">
        {{btn.tooltip}}
      </q-tooltip>
    </q-btn>
    <q-separator vertical spaced />
    <!--
    /**
    * Выравнивание
    */
    -->
    <q-btn
      v-for="btn in editorBtns.alignText" :key="btn.id"
      :icon="btn.icon"
      @click="doEdditorAction(btn.action)"
      dense
      flat
      :class="checkActiveClass('alignText',btn.action)"
    >
      <q-tooltip transition-show="scale" transition-hide="scale">
        {{btn.tooltip}}
      </q-tooltip>
    </q-btn>
    <q-separator vertical spaced />
    <!--
    /**
    * Цвет текста
    */
    -->
    <div>
      <q-btn-dropdown
        @click="setFontColor(fontColor)"
        split
        :icon="fontColorIcon"
        class="dropdownBtn_no-split-border"
        dense
        flat
      >
        <q-list>
          <q-item>
            <q-item-section>
              <q-color
                v-model="fontColor"
                @change="setFontColor(fontColor)"
                default-view="palette"
                no-header-tabs
                no-footer
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-tooltip transition-show="scale" transition-hide="scale">
        Цвет текста
      </q-tooltip>
    </div>
    <!--
    /**
    * Цвет фона
    */
    -->
    <div>
      <q-btn-dropdown
        @click="setBgColor(bgColor)"
        split
        :icon="bgColorIcon"
        class="dropdownBtn_no-split-border"
        dense
        flat
      >
        <q-list>
          <q-item-section>
            <q-color v-model="bgColor" default-view="spectrum" no-header-tabs no-footer></q-color>
          </q-item-section>
        </q-list>
      </q-btn-dropdown>
      <q-tooltip transition-show="scale" transition-hide="scale">
        Цвет фона текста
      </q-tooltip>
    </div>
    <q-separator vertical spaced />
    <!--
    /**
    * Списки
    */
    -->
    <q-btn
      v-for="btn in editorBtns.lists" :key="btn.id"
      :icon="btn.icon"
      @click="doEdditorAction(btn.action)"
      dense
      flat
      :class="checkActiveClass('lists', btn.action)"
    >
      <q-tooltip transition-show="scale" transition-hide="scale">
        {{btn.tooltip}}
      </q-tooltip>
    </q-btn>
  </q-toolbar>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  selectedCell: Object,
  itemRefs: Object
})

const editorBtns = {
  fontStyle: [
    { id: 1, icon: 'format_bold', action: 'bold', tooltip: 'Полужирный (Ctrl+B)' },
    { id: 2, icon: 'format_italic', action: 'italic', tooltip: 'Курсив (Ctrl+I)' },
    { id: 3, icon: 'format_underlined', action: 'underline', tooltip: 'Подчеркнутый (Ctrl+U)' },
    { id: 4, icon: 'strikethrough_s', action: 'strike', tooltip: 'бульп' }
  ],
  alignText: [
    { id: 5, icon: 'mdi-format-align-left', action: 'left', tooltip: 'Выравнивание по левому краю (Ctrl+Shift+L)' },
    { id: 6, icon: 'mdi-format-align-center', action: 'center', tooltip: 'Выравнивание по центру (Ctrl+Shift+E)' },
    { id: 7, icon: 'mdi-format-align-right', action: 'right', tooltip: 'Выравнивание по правому краю (Ctrl+Shift+R)' },
    { id: 8, icon: 'mdi-format-align-justify', action: 'justify', tooltip: 'Выравнивание по ширине (Ctrl+Shift+J)' }
  ],
  lists: [
    { id: 9, icon: 'checklist', action: 'taskList', tooltip: 'Контрольный список (Ctrl+Shift+9)' },
    { id: 10, icon: 'format_list_bulleted', action: 'bulletList', tooltip: 'Маркированный список (Ctrl+Shift+8)' },
    { id: 11, icon: 'format_list_numbered', action: 'orderedList', tooltip: 'Нумерованный список (Ctrl+Shift+7)' }
  ]
}

function doEdditorAction (action) {
  props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].editorAction(action)
}

function checkActiveClass (group, btn) {
  let activeClass = ''
  if (group === 'fontStyle' || group === 'lists') {
    activeClass = props.selectedCell.colName !== '' && props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].editor.isActive(btn) ? 'bg-grey-8 text-blue-6' : ''
  } else if (group === 'alignText') {
    activeClass = props.selectedCell.colName !== '' && props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].editor.isActive({ textAlign: btn }) ? 'bg-grey-8 text-blue-6' : ''
  } else if (group === 'fontColor') {
    activeClass = props.selectedCell.colName !== '' && props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].editor.isActive('textStyle', { color: '#958DF1' }) ? 'bg-grey-8 text-blue-6' : ''
  }
  return activeClass
}

const letterColor = computed(() => {
  const defaultLetterColor = $q.dark.isActive ? '#FFFFFF' : '#000000'
  return defaultLetterColor
})

const fontColor = ref('')
const fontColorIcon = computed(() => {
  const letter = letterColor.value.replace('#', '%23')
  const selectedColor = fontColor.value.replace('#', '%23')
  return `img:data:image/svg+xml;charset=utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'>
    <path d='M 4.5 48 v -7 h 39 v 7 z ' fill='${selectedColor}'/>
    <path d='M 11 34 L 22 6 h 4 l 11 28 h -3.75 l -2.85 -7.5 H 17.6 L 14.75 34 Z m 7.8 -10.7 h 10.4 L 24.1 9.75 h -0.2 Z' fill='${letter}'/>
  </svg>`
})
function setFontColor (fontColor) {
  props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].setFontColor(fontColor)
}

const bgColor = ref('')
const bgColorIcon = computed(() => {
  const letter = letterColor.value.replace('#', '%23')
  const selectedColor = bgColor.value.replace('#', '%23')
  return `img:data:image/svg+xml;charset=utf8,
  <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
    <path d="m 6.85 36.65 l 6 -6 l -0.2 -0.2 q -1.1 -1.1 -1.075 -2.775 Q 11.6 26 12.7 24.9 L 32.75 4.85 Q 33.6 4 34.9 4 q 1.3 0 2.15 0.85 l 5.6 5.6 q 0.85 0.85 0.825 2.275 Q 43.45 14.15 42.6 15 L 22.55 35.05 q -0.95 0.95 -2.625 0.95 t -2.625 -0.95 l -0.55 -0.55 l -2.15 2.15 Z M 28.7 18.9 Z m 2.85 2.9 l -5.75 -5.75 L 14.15 27.7 l 5.75 5.75 Z" fill="${letter}"/>
    <path d="M 4 48 v -6.05 h 40 V 48 Z" fill="${selectedColor}"/>
  </svg>`
})
function setBgColor (bgColor) {
  props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].setBgColor(bgColor)
}

// function toggleTask () {
//   props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].toggleTask()
// }

// function bulletedList () {
//   props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].toggleTask()
// }

// const authStore = useAuthStore()
// const $q = useQuasar()

</script>

<style>
.editorToolbar {
  z-index: 2;
  position: sticky;
  top: 0;
  min-height: 38px;
  display: flex;
}

.dropdownBtn_no-split-border .q-btn-dropdown__arrow-container {
  border: none !important;
}
</style>
