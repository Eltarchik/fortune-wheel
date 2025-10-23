<script setup lang="ts">

    interface Props {
        placeholder?: string
    }

    const { placeholder = "" } = defineProps<Props>()

    const model = defineModel<string>()

</script>

<template>
    <label class="text-input">
        <input type="text" :placeholder="placeholder" v-model="model" />
    </label>
</template>

<style scoped lang="scss">

    .text-input {
        display: flex;
        align-items: center;
        padding-inline: 16px;
        height: 40px;
        width: 100%;
        background-color: #99999933;
        border-radius: 8px;
    }

    input {
        color: #FFFFFF;
    }

</style>