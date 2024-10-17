import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import '@arco-design/web-vue/dist/arco.css'
import '@icon-park/vue-next/styles/index.css'
import 'prosemirror-view/style/prosemirror.css'
import 'animate.css'
import '@/assets/styles/prosemirror.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/font.scss'

import Icon from '@/plugins/icon'
import Directive from '@/plugins/directive'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

const app = createApp(App)
app.use(Icon)
app.use(Directive)
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(createPinia())
app.mount('#app')
