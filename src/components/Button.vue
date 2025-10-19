<script setup lang="ts">
    import Text from "./Text.vue";

    interface Props {
        accent?: boolean
        fillWidth?: boolean
        onClick: () => void
    }

    const { accent = false, fillWidth = false, onClick } = defineProps<Props>()
</script>

<template>
    <button class="button" :class="{accent, fillWidth}" @click="onClick">
        <Text :color="accent ? '#000000' : '#FFFFFF'">
            <slot/>
        </Text>
    </button>
</template>

<style scoped lang="scss">
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #99999933;
        border-radius: 8px;
        height: 40px;
        padding-inline: 32px;

        &.accent {
            background-color: #3F88E4;
        }

        &.fillWidth {
            width: 100%;
        }
    }
</style>