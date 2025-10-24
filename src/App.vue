<script setup lang="ts">

    import NavigationBar from "./components/NavigationBar.vue"
    import {onMounted} from "vue"
    import {useAuthStore} from "./stores/auth.ts"
    import { fetch } from "@tauri-apps/plugin-http"
    import {useRouter} from "vue-router"

    onMounted(async () => {
        const router = useRouter()
        await router.push('/cars')

        try {
            const body = JSON.stringify({
                username: import.meta.env.VITE_ADMIN_LOGIN,
                password: import.meta.env.VITE_ADMIN_PASSWORD
            })

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body
            })

            if (!response.ok) return

            const token = (await response.json()).access as string
            const auth = useAuthStore()
            auth.setToken(token)

        } catch (error) {
            console.error(error)
        }
    })

</script>

<template>
    <main class="container">
        <NavigationBar />
        <RouterView/>
    </main>
</template>

<style lang="scss">

  .container {
      display: flex;
      flex-direction: column;
      padding-top: 20px;
      height: 100vh;
      max-height: 100vh;
      background-image: linear-gradient(#2A2D32, #131313);
  }

</style>