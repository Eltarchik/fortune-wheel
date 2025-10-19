<script setup lang="ts">
    import NavigationBar from "./components/NavigationBar.vue"
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