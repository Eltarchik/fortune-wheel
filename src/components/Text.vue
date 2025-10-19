<script setup lang="ts">
    interface Props {
        color?: string
    }

    const { color = "#707070" } = defineProps<Props>()
</script>

<template>
    <p class="text">
        <slot />
    </p>
</template>

<style scoped lang="scss">
    .text {
        color: v-bind(color);

        font-weight: 400;
        font-size: 16px;
    }
</style>