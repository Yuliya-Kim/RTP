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
        v-model="fontColorMenu"
        @click="setFontColor(fontColor)"
        split
        :icon="fontColorIcon"
        class="dropdownBtn_no-split-border"
        dense
        flat
      >
        <q-card class="bg-grey-9">
          <q-card-section class="q-pa-sm">
            <div class="column q-gutter-xs">
              <q-btn
                @click="fontColor='', setFontColor ('')"
                align="left"
                icon="o_format_color_reset"
                dense
                flat
              >Авто</q-btn>
            </div>
            <div v-for="colorArr in colorsPallete" :key="colorArr" class="column q-gutter-xs colorRow">
              <div class="row q-gutter-xs ">
                <div
                  v-for="color in colorArr" :key="color"
                  @click="fontColor=color, setFontColor (color), fontColorMenu=false"
                  :style="`background-color: ${color}`"
                  class="colorCell"
                  :class="{ 'active': fontColor===color }"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
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
        <q-card class="bg-grey-9">
          <q-card-section class="q-pa-sm">
            <div class="column q-gutter-xs">
              <q-btn
                @click="props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].unsetBgColor()"
                align="left"
                icon="o_format_color_reset"
                dense
                flat
              >Нет</q-btn>
            </div>
            <div v-for="colorArr in colorsPallete" :key="colorArr" class="column q-gutter-xs colorRow">
              <div class="row q-gutter-xs ">
                <div
                  v-for="color in colorArr" :key="color"
                  @click="bgColor=color, setBgColor (color)"
                  :style="`background-color: ${color}`"
                  class="colorCell"
                  :class="{ 'active': bgColor===color }"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-btn-dropdown>
      <q-tooltip transition-show="scale" transition-hide="scale">
        Цвет фона
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
      :disable="props.selectedCell.colName==='info_status'"
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

const props = defineProps({
  selectedCell: Object,
  itemRefs: Object
})

const $q = useQuasar()

const editorBtns = {
  fontStyle: [
    { id: 1, icon: 'format_bold', action: 'bold', tooltip: 'Полужирный (Ctrl+B)' },
    { id: 2, icon: 'format_italic', action: 'italic', tooltip: 'Курсив (Ctrl+I)' },
    { id: 3, icon: 'format_underlined', action: 'underline', tooltip: 'Подчеркнутый (Ctrl+U)' },
    { id: 4, icon: 'strikethrough_s', action: 'strike', tooltip: 'Зачеркнутый' }
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

const colorsPallete = {
  colors: ['#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'],
  light3: ['#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc'],
  light2: ['#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
  light1: ['#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0'],
  dark1: ['#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79'],
  dark2: ['#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47'],
  dark3: ['#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130']
}

function doEdditorAction (action) {
  props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].editorAction(action)
}

function checkActiveClass (group, btn) {
  let activeClass = ''
  if (group === 'fontStyle' || group === 'lists') {
    activeClass = props.selectedCell.colName !== '' && props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].editor.isActive(btn) ? 'bg-grey-8 text-cyan-13' : ''
  } else if (group === 'alignText') {
    activeClass = props.selectedCell.colName !== '' && props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].editor.isActive({ textAlign: btn }) ? 'bg-grey-8 text-cyan-13' : ''
  } else if (group === 'fontColor') {
    activeClass = props.selectedCell.colName !== '' && props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].editor.isActive('textStyle', { color: '#958DF1' }) ? 'bg-grey-8 text-cyan-13' : ''
  }
  return activeClass
}

const letterColor = computed(() => {
  const defaultLetterColor = $q.dark.isActive ? '#FFFFFF' : '#000000'
  return defaultLetterColor
})

const fontColorMenu = ref(false)
const fontColor = ref('#cc0000')
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
  if (props.selectedCell.colName !== '') {
    props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].setFontColor(fontColor)
  }
}

const bgColor = ref('#FFF176')
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
  if (props.selectedCell.colName !== '') {
    props.itemRefs[props.selectedCell.colName][props.selectedCell.rowId].setBgColor(bgColor)
  }
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

<style lang="scss">
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

.colorRow:first-child {
  padding-bottom: 5px;
}

.colorCell {
  width: 20px;
  height: 20px;
  cursor: pointer;

  &:hover {
    outline: 1px solid grey;
  }

  &.noColor {
    outline: 1px solid white;
  }

  &.active {
    outline: 1.5px solid red;
  }
}

</style>
