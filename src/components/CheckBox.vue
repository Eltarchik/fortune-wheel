<script setup lang="ts">
    import Text from "./Text.vue"
    import CheckMarkIcon from "../icons/CheckMarkIcon.vue"

    const model = defineModel<boolean>()

</script>

<template>
    <label class="checkbox">
        <input type="checkbox" v-model="model" hidden />
        <span class="box" :class="{ checked: model }">
            <CheckMarkIcon v-show="model" color="#000000" />
        </span>
        <Text :color="model ? '#FFFFFF' : '#999999'">
            <slot />
        </Text>
    </label>
</template>

<style scoped lang="scss">
    .checkbox {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
    }

    .box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid #707070;

        &.checked {
            background-color: #3F88E4;
            border: none;
        }
    }
</style>