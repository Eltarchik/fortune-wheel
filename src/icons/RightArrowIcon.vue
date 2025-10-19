<script setup lang="ts">
    interface Props {
        color: string
    }
    const { color = "#FFFFFF" } = defineProps<Props>()
</script>

<template>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.93142 14.0657L4.80005 12.9343L9.73436 7.99999L4.80005 3.06567L5.93142 1.9343L11.9971 7.99999L5.93142 14.0657Z" :fill="color"/>
    </svg>
</template>

<style scoped lang="scss">

</style>