<script setup lang="ts">
    interface Props {
        color?: string
        size?: number | string
    }
    const { color = "#FFFFFF", size = 16 } = defineProps<Props>()
</script>

<template>
    <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.66325 1.67089C7.26875 0.50977 8.73134 0.509768 9.33685 1.67089L14.9755 12.4835C15.5989 13.6791 14.8504 15.2 13.6387 15.2H2.36142C1.14965 15.2 0.401167 13.6791 1.02462 12.4835L6.66325 1.67089ZM7.20005 9.20005V5.20005H8.80005V9.20005H7.20005ZM8.00005 12.8C7.33731 12.8 6.80005 12.2628 6.80005 11.6C6.80005 10.9373 7.33731 10.4 8.00005 10.4C8.66279 10.4 9.20005 10.9373 9.20005 11.6C9.20005 12.2628 8.66279 12.8 8.00005 12.8Z" :fill="color"/>
    </svg>
</template>

<style scoped lang="scss">

</style>