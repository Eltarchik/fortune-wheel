<script setup lang="ts">
    import {computed, nextTick, ref} from "vue"
    import Heading, {HeadingSize} from "./Heading.vue"
    import {validateNumber} from "../utils/CarNumbers.ts"

    const isEditMode = ref<boolean>(false)
    const placeholder = "N111NN777"

    const model = defineModel<string>()
    const inputRef = ref<HTMLInputElement | null>(null)

    const displayedNumber = computed<string>(() => model.value || placeholder)
    const mainNumber = computed<string>(() => displayedNumber.value.slice(0, 6))
    const subNumber = computed<string>(() => displayedNumber.value.slice(6))
    const numberColor = computed<string>(() =>
        displayedNumber.value === model.value?.toString() ? "#000000" : "#999999"
    )

    const trySetNumber = () => {
        if (validateNumber(model.value || "")) {
            model.value = model.value!.toUpperCase()

        } else {
            model.value = ""
        }
    }

    const startEditing = async () => {
        isEditMode.value = true
        await nextTick()
        inputRef.value?.focus()
    }

</script>

<template>
    <div class="car-number-input">
        <button v-show="!isEditMode" class="preview" @click="startEditing">
            <Heading :size="HeadingSize.LARGE" :color="numberColor">{{ mainNumber }}</Heading>
            <Heading class="region" :color="numberColor"  >{{ subNumber }}</Heading>
        </button>
        <label v-show="isEditMode" class="edit">
            <input class="input" type="text" maxlength="9" ref="inputRef" v-model="model" @blur="() => {
            trySetNumber()
            isEditMode = false
        }" />
        </label>
    </div>
</template>

<style scoped lang="scss">
    .car-number-input {
        width: 200px;
    }

    .preview, .edit {
        display: flex;
        gap: 4px;
        height: 40px;
        width: 100%;
        padding-inline: 12px;
        background-color: #D9D9D9;
        border-radius: 8px;
    }

    .region {
        padding-top: 2px;
    }

    .input {
        font-size: 20px;
        font-weight: 600;
        width: 100%;
    }

</style>