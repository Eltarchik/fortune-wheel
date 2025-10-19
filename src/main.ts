import { createApp } from "vue"
import App from "./App.vue"
import Profile from "./pages/Profile.vue"
import "./assets/styles/global.scss"
import "./assets/styles/theme.scss"
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router"
import Cars from "./pages/Cars.vue"

const routes: Readonly<RouteRecordRaw[]> = [
    { name: 'profile', path: '/profile', component: Profile },
    { name: 'cars', path: '/cars', component: Cars },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App).use(router).mount("#app")
