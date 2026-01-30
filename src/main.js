import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n' // <--- 1. IMPORT THIS

const app = createApp(App)

app.use(router)
app.use(i18n) // <--- 2. USE THIS (Before mount)

app.mount('#app')