import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'aos/dist/aos.css'
import 'fullpage.js/dist/fullpage.css'
import VueFullPage from 'vue-fullpage.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useKakao } from 'vue3-kakao-maps/@utils';

useKakao(import.meta.env.VITE_KAKAO_MAP_SERVICE_KEY, ['clusterer', 'services', 'drawing']);

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueFullPage)

app.mount('#app')
