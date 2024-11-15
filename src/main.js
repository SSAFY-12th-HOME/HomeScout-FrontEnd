import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'aos/dist/aos.css'
import 'fullpage.js/dist/fullpage.css'
import VueFullPage from 'vue-fullpage.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueFullPage)

app.mount('#app')
