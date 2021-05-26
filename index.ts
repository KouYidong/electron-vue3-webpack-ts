// import _ from 'lodash'

// function test () {
//   const element = document.createElement('div')
//   element.innerHTML = _.join(['Hello', 'webpack'], '-')
//   return element
// }

import { createApp } from 'Vue'
import App from './App.vue'

createApp(App).mount('#app')

