<script setup lang="ts">
    interface Props {
        color?: string
        size?: number | string
    }
    const { color = "#FFFFFF", size = 16 } = defineProps<Props>()
</script>

<template>
    <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_269_788)">
            <path d="M8 3C12 3 15 7 15 8C15 8.27508 14.773 8.77718 14.3606 9.36059M4.5 4.01865C2.3731 5.27383 1 7.32346 1 8C1 9 4 13 8 13C9.55097 13 10.9516 12.3986 12.0853 11.6039" :stroke="color" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 14.5L2 1.5" :stroke="color" stroke-width="1.4" stroke-linecap="round"/>
            <path d="M6.58579 6.58585C5.80474 7.3669 5.80474 8.63323 6.58579 9.41428C7.36684 10.1953 8.63316 10.1953 9.41421 9.41428" :stroke="color" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
            <clipPath id="clip0_269_788">
                <rect width="16" height="16" :fill="color"/>
            </clipPath>
        </defs>
    </svg>



</template>

<style scoped lang="scss">

</style>