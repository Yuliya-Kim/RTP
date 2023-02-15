<template>
  <div v-if="editor" style="height: 100%;">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-btn
        v-show="newValue && newValue != initialValue"
        @click="emit('saveCell')"
        dense
        flat
        color="green-7"
        style="z-index: 2;"
        class="absolute-bottom-right"
        :loading="btnLoading"
      >
        <q-icon name="mdi-floppy" />
      </q-btn>
    </transition>
    <editor-content :editor="editor" />
    <q-chip
      v-show="charLimit !== 0"
      class="q-pa-none absolute-top-right"
      size="sm"
      color="transparent"
      text-color="grey-8"
      dense
    >
      {{ editor.storage.characterCount.characters() }}/{{ charLimit }}
    </q-chip>
  </div>
</template>

<script setup>

import { ref, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import CharacterCount from '@tiptap/extension-character-count'
// import ListItem from '@tiptap/extension-list-item'
// import BulletList from '@tiptap/extension-bullet-list'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  selectedCell1: {
    type: Object,
    default: null
  },
  charLimit: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'saveCell'])

const initialValue = ref(props.modelValue)
const newValue = ref(null)

const btnLoading = ref(false)

const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TaskList,
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: 'myCheckbox'
      }
    }),
    CharacterCount.configure({
      limit: props.charLimit
    })
    // BulletList
    // ListItem
  ],
  content: props.modelValue,
  autofocus: false,
  onUpdate: ({ editor }) => {
    newValue.value = editor.getHTML()
    emit('update:modelValue', newValue.value)
  }
})

watch(() => props.selectedCell1, (cell, prevCell) => {
  // editor.value.commands.setContent(initialValue.value)
  // newValue.value = null
  // btnLoading.value = false
})

function editorAction (action) {
  switch (action) {
    /**
    * Полужирный, курсив, подчеркнутый, зачеркнутый
    */
    case 'bold':
      editor.value.chain().focus().toggleBold().run()
      break
    case 'italic':
      editor.value.chain().focus().toggleItalic().run()
      break
    case 'underline':
      editor.value.chain().focus().toggleUnderline().run()
      break
    case 'strike':
      editor.value.commands.toggleStrike()
      break
    /**
    * Выравнивание
    */
    case 'left':
      editor.value.chain().focus().setTextAlign('left').run()
      break
    case 'center':
      editor.value.chain().focus().setTextAlign('center').run()
      break
    case 'right':
      editor.value.chain().focus().setTextAlign('right').run()
      break
    case 'justify':
      editor.value.chain().focus().setTextAlign('justify').run()
      break
    /**
    * Списки
    */
    case 'taskList':
      editor.value.chain().focus().toggleTaskList().run()
      break
    case 'bulletList':
      editor.value.chain().focus().toggleBulletList().run()
      break
    case 'orderedList':
      editor.value.chain().focus().toggleOrderedList().run()
      break
  }
}

function setFontColor (color) {
  editor.value.chain().focus().setColor(color).run()
}
function setBgColor (color) {
  editor.value.chain().focus().toggleHighlight({ color: color }).run()
}

function toggleTask () {
  editor.value.chain().focus().toggleTaskList().run()
}

// function btnState () {
//   return editor.value.isActive('bold')
// }

defineExpose({
  editor,
  editorAction,
  setFontColor,
  setBgColor,
  toggleTask,
  btnLoading,
  initialValue
})

</script>

<style lang="scss">
// .is-active {
//   background: grey;
//   color: #fff;
// }
.ProseMirror {
  padding: 10px;

  ul, ol { padding: 0 1rem; }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    p {
      margin: 0;
    }

    li {
      display: flex;

      // &.myCheckbox {
      //   label {
      //     position: relative;
      //     padding-left: 30px;
      //     font-size: 22px;

      //     input {
      //       position: absolute;
      //       opacity: 0;
      //       height: 0;
      //       width: 0;
      //       &:checked ~ span {
      //         background-color: #2196F3;
      //         &:after {
      //           display: block;
      //         }
      //       }
      //     }

      //     span {
      //       position: absolute;
      //       top: 0;
      //       left: 0;
      //       height: 16px;
      //       width: 16px;
      //       background-color: #eee;

      //       &:after {
      //         content: "";
      //         position: absolute;
      //         display: none;
      //         left: 4px;
      //         top: 0px;
      //         width: 7px;
      //         height: 12px;
      //         border: solid white;
      //         border-width: 0 3px 3px 0;
      //         border-radius: 8px;
      //         -webkit-transform: rotate(45deg);
      //         -ms-transform: rotate(45deg);
      //         transform: rotate(45deg);
      //       }
      //     }
      //   }
      // }

      label:hover input ~ span {
        background-color: #ccc;
      }

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}
</style>
