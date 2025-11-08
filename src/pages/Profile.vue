<script setup lang="ts">
    import ContentBlock from "../components/ContentBlock.vue"
    import Heading from "../components/Heading.vue"
    import Text from "../components/Text.vue"
    import Modal from "../components/Modal.vue"
    import {onMounted, ref} from "vue"
    import CarNumber from "../components/CarNumber.vue"
    import {UserData} from "../types/api/UserData.ts"
    import RightArrowIcon from "../icons/RightArrowIcon.vue"
    import PlusIcon from "../icons/PlusIcon.vue"
    import CarNumberInput from "../components/CarNumberInput.vue"
    import Button from "../components/Button.vue"
    import {validateNumber} from "../utils/CarNumbers.ts"
    import CheckBox from "../components/CheckBox.vue"
    import { fetch } from "@tauri-apps/plugin-http"
    import {useRouter} from "vue-router"

    interface UserParam {
        title: string
        content: string
    }

    interface Courtyard {
        id: number
        address: string
        carNumbers: string[]
    }

    interface UserInfo {
        name: UserParam
        phone: UserParam
        courtyards: Courtyard[]
    }

    const userInfo = ref<UserInfo>({
        name: {
            title: "ФИО",
            content: ""
        },
        phone: {
            title: "Телефон",
            content: ""
        },
        courtyards: []
    })

    interface ModalData {
        yardId: number
        title: string
        numbers: string[]
    }

    const mockUserId = 3

    const router = useRouter()

    const modalIsOpen = ref<boolean>(false)
    const addingNumberMode = ref<boolean>(false)
    const modalData = ref<ModalData | null>(null)

    const refNewNumber = ref<string | undefined>(undefined)

    const showModal = (courtyard: Courtyard) => {
        modalData.value = {
            yardId: courtyard.id,
            title: courtyard.address,
            numbers: courtyard.carNumbers
        }
        modalIsOpen.value = true
    }

    const onModalClose = () => {
        modalIsOpen.value = false
        addingNumberMode.value = false
        modalData.value = null
    }

    const addNumber = async () => {
        if (!refNewNumber.value || !validateNumber(refNewNumber.value) || ! modalData.value) return

        const body = JSON.stringify({
            auto_number: refNewNumber.value,
            owner: mockUserId,
            yard_id: [modalData.value.yardId]
        })

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/yard/add-auto/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body
        })

        if (!response.ok) return

        addingNumberMode.value = false
        modalData.value.numbers.push(refNewNumber.value)
        refNewNumber.value = undefined
    }

    const enterAddingNumbersMode = () => {
        if (!modalData.value) return
        addingNumberMode.value = true
    }

    onMounted(async () => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/account/${mockUserId}/`)
        const userData: UserData = await response.json()

        userInfo.value.name.content = userData.name || "Не указано"
        userInfo.value.phone.content = userData.phone || "Не указан"
        userInfo.value.courtyards = Object
            .entries(userData.addresses)
            .map(([address, data]) => ({
                id: data.yard_id,
                address,
                carNumbers: data.auto_numbers
            }))

        if (!userInfo.value.courtyards.length) return
    })

</script>

<template>
    <div class="profile">
        <div class="content">
            <ContentBlock title="Мои дворы">
                <div class="courtyards">
                    <Modal v-model:show="modalIsOpen"
                           hideButtons
                           :on-close="onModalClose"
                    >
                        <div class="numbers-modal">
                            <CarNumber :number="number" large v-for="number in modalData?.numbers" :key="number" />
                            <button v-if="!addingNumberMode" class="add-number" @click="enterAddingNumbersMode">
                                <PlusIcon color="#000000" size="32" />
                            </button>
                            <div v-if="addingNumberMode" class="add-number-form">
                                <CarNumberInput v-model="refNewNumber" class="add-number-input"/>
                                <button class="add-number-button" @click="addNumber">
                                    <PlusIcon color="#000000" size="32" />
                                </button>
                            </div>
                        </div>
                    </Modal>
                    <button v-for="courtyard in userInfo.courtyards" :key="courtyard.id"
                            class="manage-cars"
                            @click="showModal(courtyard)"
                    >
                        <Text color="#3F88E4">{{ courtyard.address }}</Text>
                        <RightArrowIcon color="#3F88E4"/>
                    </button>
                </div>
            </ContentBlock>

            <ContentBlock title="Мои данные">
                <div class="user-info">
                    <div class="info-item" v-for="param in [userInfo.name, userInfo.phone]" :key="param.title">
                        <Heading>{{param.title}}</Heading>
                        <Text>{{param.content}}</Text>
                    </div>
                </div>
            </ContentBlock>
        </div>

        <footer class="footer">
            <Button :on-click="() => router.push('/auth')">Выйти</Button>
        </footer>
    </div>
</template>

<style scoped>
    .profile {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        overflow: hidden;
        gap: 32px;
    }

    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow: auto;
        gap: 32px;
    }

    .courtyards {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .manage-cars {
        display: flex;
        gap: 4px;
        align-items: center;
        cursor: pointer;
    }

    .profile {
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 20px;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 16px;
        width: 100%;
    }

    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .numbers-modal {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 20px;
        padding-block: 12px;
        max-height: 400px;
        overflow: auto;
        scrollbar-width: none;

        .add-number {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            width: 200px;
            background-color: #3F88E4;
            border-radius: 8px;
        }

        .add-number-form {
            display: flex;
        }

        .add-number-input {
            z-index: 2;
        }

        .add-number-button {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            width: 48px;
            margin-left: -8px;
            padding-left: 6px;
            background-color: #3F88E4;
            border-radius: 0 8px 8px 0;
            z-index: 1;
        }
    }

    .footer {
        display: flex;
        justify-content: end;
        width: 100%;
    }
</style>