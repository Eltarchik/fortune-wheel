import { createApp } from "vue"
import App from "./App.vue"
import Profile from "./pages/Profile.vue"
import "./assets/styles/global.scss"
import "./assets/styles/theme.scss"
import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router"
import Cars from "./pages/Cars.vue"
import {createPinia} from "pinia"
import Auth from "./pages/Auth.vue"

const routes: Readonly<RouteRecordRaw[]> = [
    { name: 'profile', path: '/profile', component: Profile },
    { name: 'cars', path: '/cars', component: Cars },
    { name: 'auth', path: '/auth', component: Auth },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount("#app")
