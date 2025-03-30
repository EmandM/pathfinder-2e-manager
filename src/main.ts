import ElementPlus from 'element-plus'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { routes } from 'vue-router/auto-routes'

import App from './App.vue'

import '~/styles/index.scss'
import 'uno.css'

const app = createApp(App)
app.use(createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
}))
app.use(ElementPlus)
app.mount('#app')
