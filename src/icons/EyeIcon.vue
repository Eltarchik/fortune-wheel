<script setup lang="ts">
    interface Props {
        color?: string
        size?: number | string
    }
    const { color = "#FFFFFF", size = 16 } = defineProps<Props>()
</script>

<template>
    <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 8C1 7 4 3 8 3C12 3 15 7 15 8C15 9 12 13 8 13C4 13 1 9 1 8Z" :stroke="color" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" :stroke="color" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>


</template>

<style scoped lang="scss">

</style>