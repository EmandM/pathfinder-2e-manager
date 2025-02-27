// import type { UserModule } from './types'
// import { ViteSSG } from 'vite-ssg'

// import "~/styles/element/index.scss";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'

// or use cdn, uncomment cdn link in `index.html`

// if you do not need ssg:
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { routes } from 'vue-router/auto-routes'

import App from './App.vue'
// If you want to use ElMessage, import it.
// import 'element-plus/theme-chalk/src/message.scss'
// import 'element-plus/theme-chalk/src/message-box.scss'

// import all element css, uncommented next line
import 'element-plus/dist/index.css'
import '~/styles/index.scss'
import 'uno.css'

const app = createApp(App)
app.use(createRouter({
  history: createWebHistory(),
  routes,
}))
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')

// https://github.com/antfu/vite-ssg
// export const createApp = ViteSSG(
//   App,
//   {
//     routes,
//     base: import.meta.env.BASE_URL,
//   },
//   (ctx) => {
//     // install all modules under `modules/`
//     Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
//       .forEach(i => i.install?.(ctx))
//     // ctx.app.use(Previewer)
//   },
// )
