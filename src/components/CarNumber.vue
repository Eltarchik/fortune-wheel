<script setup lang="ts">
    import Heading from "./Heading.vue"
    import Text from "./Text.vue"

    interface Props {
        number: string
    }

    const { number } = defineProps<Props>()

    const mainNumber = number.slice(0, 6)
    const subNumber = number.slice(6)
</script>

<template>
    <div class="card">
        <Heading color="#000000">{{ mainNumber }}</Heading>
        <Text v-if="subNumber" color="#000000">{{ subNumber }}</Text>
    </div>
</template>

<style scoped lang="scss">
    .card {
        display: flex;
        gap: 4px;
        padding: 1px 8px;
        width: fit-content;
        height: 28px;
        background-color: #D9D9D9;
        border-radius: 4px;
    }
</style>