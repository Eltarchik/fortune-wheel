<script setup lang="ts">

    import PhoneInput from "../components/inputs/PhoneInput.vue"
    import PasswordInput from "../components/inputs/PasswordInput.vue"
    import BasicButton from "../components/BasicButton.vue"
    import Heading, {HeadingSize} from "../components/Heading.vue"
    import Text from "../components/Text.vue"
    import {ref} from "vue"
    import {validatePhone} from "../utils/InputValidations.ts"
    import {Preferences} from "@capacitor/preferences"
    import BasicInput from "../components/inputs/BasicInput.vue";
    import {useRouter} from "vue-router";
    import ErrorIcon from "../icons/ErrorIcon.vue";
    import {AuthData} from "../types/api/Auth.ts";
    import { fetch } from "@tauri-apps/plugin-http"

    const router = useRouter()

    const name = ref<string>("")
    const phone = ref<string>("")
    const password = ref<string>("")

    const phoneErrorMsg = ref<string | null>(null)
    const invalidData = ref<boolean>(false)

    const validatePhoneInput = () => {
        if (!phone.value || validatePhone(phone.value)) {
            phoneErrorMsg.value = null
            return
        }
        phoneErrorMsg.value = "Некорректный номер"
    }

    const allFieldsIsValid = () => {
        return phone.value && validatePhone(phone.value) && password.value.trim() && name.value.trim()
    }

    const submit = async () => {
        if (!allFieldsIsValid()) return

        const body = JSON.stringify({
            full_name: name.value,
            phone: phone.value.replace(/\+7/g, "8"),
            password: password.value,
            password_confirm: password.value,
        })

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body
            })

            if (!response.ok) {
                invalidData.value = true
                return
            }

            const data = await response.json() as AuthData

            const accessToken = data.access as string
            const refreshToken = data.refresh as string
            const userId = data.user.id
            await Preferences.set({ key: "access_token", value: accessToken })
            await Preferences.set({ key: "refresh_token", value: refreshToken })
            await Preferences.set({ key: "user_id", value: userId.toString() })

            await router.push("/cars")

        } catch (error) {
            console.error(error)
            invalidData.value = true
        }
    }

</script>

<template>
    <div class="wrapper">
        <Heading :size="HeadingSize.LARGE">Регистрация</Heading>
        <div class="form">
            <BasicInput v-model="name" placeholder="ФИО"
                        :error="invalidData"
                        @blur="invalidData = false"
            />
            <PhoneInput v-model="phone"
                        :error="!!phoneErrorMsg || invalidData"
                        :error-msg="phoneErrorMsg || undefined"
                        @blur="validatePhoneInput(); invalidData = false"
            />
            <div class="invalid-data" v-if="invalidData">
                <ErrorIcon color="#FFFFFF" />
                <Text color="#FFFFFF">Некорректные данные</Text>
            </div>
            <PasswordInput v-model="password" :error="invalidData" @blur="invalidData = false" />
            <BasicButton accent @click="submit">Создать аккаунт</BasicButton>
            <Text color="#FFFFFF" class="text">
                Уже есть аккаунт? <router-link to="/auth" class="link">Авторизоваться</router-link>
            </Text>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 80px;
        padding-inline: 20px;
        height: fit-content;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .text {
        align-self: center;
    }

    .link {
        color: #3F88E4;
    }

    .invalid-data {
        display: flex;
        gap: 8px;
    }
</style>