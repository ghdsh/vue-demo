import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Element Plus base theme (dark mode vars + action component styles)
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-alert.css'
import 'element-plus/theme-chalk/el-popconfirm.css'
import 'element-plus/theme-chalk/el-overlay.css'
import './style.scss'
import { initTheme } from './stores/theme'
import App from './App.vue'
import router from './router'

// Apply saved theme before mount to prevent flash of wrong theme
initTheme()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
