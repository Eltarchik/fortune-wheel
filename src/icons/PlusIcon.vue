<script setup lang="ts">
    interface Props {
        color?: string
        size?: number | string
    }
    const { color = "#FFFFFF", size = 16 } = defineProps<Props>()
</script>

<template>
    <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.69995 9.30002V14.1H9.29995V9.30002H14.0999V7.70002H9.29995V2.90002H7.69995V7.70003H2.8999V9.30002H7.69995Z" :fill="color"/>
    </svg>

</template>

<style scoped lang="scss">

</style>