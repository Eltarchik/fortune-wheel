<script setup lang="ts">
    import Heading, {HeadingSize} from "./Heading.vue"

    interface Props {
        title: string
    }

    const { title } = defineProps<Props>()
</script>

<template>
    <div class="block">
        <Heading :size="HeadingSize.LARGE">{{title}}</Heading>
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
    .block {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 20px;
        width: 100%;
    }

    .content {
        display: flex;
        width: 100%;
    }
</style>