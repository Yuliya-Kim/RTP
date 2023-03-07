<template>
  <node-view-wrapper class="vue-component">
    <div class="content">
      <button @click="$emit('saveCell')">Эту кнопавку нажали {{ node.attrs.count }} раз(а).</button>
    </div>
    <!-- <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-btn
        v-if="activeCell"
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
    </transition> -->
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

export default {
  components: {
    NodeViewWrapper
  },

  props: nodeViewProps,
  emits: ['saveCell'],
  methods: {
    saveCell () {
      this.updateAttributes({
        count: this.node.attrs.count + 1
      })
    }
  }
}
</script>
