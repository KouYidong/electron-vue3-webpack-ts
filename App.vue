<template>
  <div class="app">Welcome to Your Vue.js App</div>
  123123111
  {{ test() }}
</template>

<script lang="ts">
import { onMounted } from 'vue'
export default {
  name: 'App',
  setup() {
    const test = (): string => {
      return `test fun result`
    }

    onMounted(() => {

    })

    return {
      test
    }
  },
}
</script>