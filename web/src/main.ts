import {createApp} from "vue"
import ElementPlus from "element-plus"
import router from "./router"
import App from "./App.vue"
import {createPinia} from "pinia"

import "./style.css"
import "element-plus/dist/index.css"

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.mount("#app")
