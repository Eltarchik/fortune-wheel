<script setup lang="ts">

    import BasicInput from "./BasicInput.vue"
    import EyeIcon from "../../icons/EyeIcon.vue"
    import ClosedEyeIcon from "../../icons/ClosedEyeIcon.vue"
    import {ref} from "vue"

    interface Props {
        error?: boolean
        errorMsg?: string
    }

    const { error = false, errorMsg } = defineProps<Props>()
    const model = defineModel<string>()
    const emit = defineEmits(["blur"])

    const showPassword = ref<boolean>()

</script>

<template>
    <BasicInput :type="showPassword ? 'text' : 'password'" placeholder="Пароль" v-model="model"
                :error="error"
                :errorMsg="errorMsg"
                @blur="$emit('blur')"
    >
        <template #buttons>
            <button @click="showPassword = !showPassword">
                <EyeIcon v-if="!showPassword" color="#707070" />
                <ClosedEyeIcon v-else color="#707070" />
            </button>
        </template>
    </BasicInput>
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