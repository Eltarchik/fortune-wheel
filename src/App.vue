<script setup lang="ts">

    import NavigationBar from "./components/NavigationBar.vue"
    import {onMounted, ref} from "vue"
    import {useRoute, useRouter} from "vue-router"
    import {Preferences} from "@capacitor/preferences"

    const loaded = ref<boolean>(false)
    const router = useRouter()
    const route = useRoute()

    onMounted(async () => {
        const token = (await Preferences.get({key: "access_token"})).value

        if (!token) await router.push("/auth")
        loaded.value = true
    })

</script>

<template>
    <main class="container">
        <NavigationBar v-if="loaded && !['/auth', '/register'].includes(route.path)" />
        <RouterView v-if="loaded" />
    </main>
</template>

<style lang="scss">

  .container {
      display: flex;
      flex-direction: column;
      padding-top: 20px;
      min-height: 100vh;
      height: 100%;
      background-image: linear-gradient(#2A2D32, #131313);
  }

</style>