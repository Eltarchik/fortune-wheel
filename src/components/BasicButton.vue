<script setup lang="ts">
    import Text from "./Text.vue"

    interface Props {
        accent?: boolean
        small?: boolean
        fillWidth?: boolean
    }

    const { accent = false, small = false, fillWidth = false } = defineProps<Props>()
    const emit = defineEmits(["click"])
</script>

<template>
    <button class="button" :class="{accent, small, fillWidth}" @click="$emit('click')">
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

        &.small {
            border-radius: 16px;
            padding-inline: 16px;
            height: 32px;
        }

        &.fillWidth {
            width: 100%;
        }
    }
</style>