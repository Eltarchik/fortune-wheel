<script setup lang="ts">

    import ErrorIcon from "../../icons/ErrorIcon.vue";
    import Text from "../Text.vue";

    interface Props {
        placeholder?: string
        type?: "text" | "number" | "password"
        error?: boolean
        errorMsg?: string
    }

    const { placeholder = "", type = "text", error = false, errorMsg } = defineProps<Props>()

    const model = defineModel<string>()
    const emit = defineEmits(["blur"])

</script>

<template>
    <div class="error-wrapper" :class="[error && 'error']">
        <label class="input" :class="[error && errorMsg && 'bottom-line']">
            <input :type="type" :placeholder="placeholder" v-model="model" @blur="$emit('blur')" />
            <span class="buttons" v-if="$slots.buttons">
                <slot name="buttons" />
            </span>
        </label>
        <div v-if="error && errorMsg" class="error-line">
            <div class="icon">
                <ErrorIcon color="#FFFFFF" />
            </div>
            <Text color="#FFFFFF">{{errorMsg}}</Text>
        </div>
    </div>
</template>

<style scoped lang="scss">

    .input {
        display: flex;
        align-items: center;
        padding-inline: 16px;
        gap: 12px;
        height: 40px;
        width: 100%;
        background-color: #99999933;
        border-radius: 8px;

        &.bottom-line {
            border-radius: 8px 8px 0 0;
        }
    }

    input {
        width: 100%;
        color: #FFFFFF;
    }

    .buttons {
        display: flex;
        gap: 12px
    }

    .error-wrapper {
        display: flex;
        flex-direction: column;
        border-radius: 16px;

        &.error {
            border: 2px solid #DA3A3A;
        }
    }

    .error-line {
        display: flex;
        gap: 8px;
        align-items: center;
        background-color: #DA3A3A;
        border-radius: 0 0 16px 16px;
        padding: 4px 12px;
    }

    .icon {
        display: flex;
    }

</style>