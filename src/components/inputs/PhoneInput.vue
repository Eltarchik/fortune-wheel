<script setup lang="ts">

    import BasicInput from "./BasicInput.vue"

    interface Props {
        error?: boolean
        errorMsg?: string
    }

    const { error = false, errorMsg } = defineProps<Props>()
    const model = defineModel<string>()
    const emit = defineEmits(["blur"])

    const filterSymbols = (event: KeyboardEvent) => {
        const { key } = event
        const validSymbols = "0123456789+"
        const system = ["Backspace", "ArrowLeft", "ArrowRight"]
        const hotkeys = "axcvz"
        const isHotkey = event.ctrlKey || event.metaKey
        const isCombo = isHotkey && hotkeys.includes(key.toLowerCase())

        if (validSymbols.includes(key) || system.includes(key) || isCombo) return

        event.preventDefault()
    }

</script>

<template>
    <BasicInput type="text" placeholder="Номер телефона" v-model="model"
                :error="error"
                :errorMsg="errorMsg"
                @blur="$emit('blur')"
                @keydown="filterSymbols"

    />
</template>

<style scoped lang="scss">

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
    }

</style>