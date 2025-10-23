<script setup lang="ts">
    interface Props {
        color: string
    }
    const { color = "#FFFFFF" } = defineProps<Props>()
</script>

<template>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 7L6 11L13 4" :stroke="color" stroke-width="1.4"/>
    </svg>
</template>

<style scoped lang="scss">

</style>