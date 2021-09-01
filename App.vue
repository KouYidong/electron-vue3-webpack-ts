<template>
  <div class="app">Welcome to Your Vue.js App</div>
  {{ test() }}
  <div class="button" @click="uploadBtn"></div>
</template>

<script lang="ts">
import { onMounted } from 'vue'
import { openSelectFileDialog } from './src/render/ipc-renderer'

export default {
  name: 'App',
  setup() {
    const uploadBtn = () => {
      openSelectFileDialog()
    }

    const test = (): string => {
      return `test fun result111`
    }

    onMounted(() => {})

    return {
      uploadBtn,
      test,
    }
  },
}
</script>
<style scoped>
.button {
  width: 100px;
  height: 50px;
  border: 1px solid red;
  cursor: pointer;
}
</style>