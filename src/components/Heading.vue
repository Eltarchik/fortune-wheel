<script lang="ts">
    export enum HeadingSize {
        SMALL, MEDIUM, LARGE
    }
</script>

<script setup lang="ts">
    interface Props {
        size?: HeadingSize
        color?: string
    }
    const { size = HeadingSize.MEDIUM, color = "#FFFFFF" } = defineProps<Props>()
</script>

<template>
    <h1 class="heading" :style="{ fontSize: '36px' }" v-if="size === HeadingSize.LARGE"><slot/></h1>
    <h3 class="heading" :style="{ fontSize: '22px' }" v-else-if="size === HeadingSize.MEDIUM"><slot/></h3>
    <h5 class="heading" :style="{ fontSize: '20px', fontWeight: '500' }" v-else><slot/></h5>
</template>

<style scoped lang="scss">
    .heading {
        color: v-bind(color);
        font-weight: 600;
    }
</style>