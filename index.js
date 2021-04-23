// import _ from 'lodash'

// function test () {
//   const element = document.createElement('div')
//   element.innerHTML = _.join(['Hello', 'webpack'], '-')
//   return element
// }

// document.body.appendChild(test())

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

