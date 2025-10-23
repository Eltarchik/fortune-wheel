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
    import CheckBox from "../components/CheckBox.vue";

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

    let modalIsOpen = ref<boolean>(false)
    let addingNumberMode = ref<boolean>(false)
    let modalData = ref<ModalData | null>(null)

    const selectedYards = ref<Record<number, boolean>>({})

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
        for (const id in selectedYards.value) {
            selectedYards.value[+id] = false
        }

        modalIsOpen.value = false
        addingNumberMode.value = false
        modalData.value = null
    }

    const addNumber = async () => {
        if (!refNewNumber.value || !validateNumber(refNewNumber.value)) return

        const body = JSON.stringify({
            auto_number: refNewNumber.value,
            owner: mockUserId,
                yard_id: Object
                .entries(selectedYards.value)
                .filter(([_, isSelected]) => isSelected)
                .map(([id]) => Number(id))
        })

        await fetch(`${import.meta.env.VITE_API_BASE_URL}/yard/add-auto/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body
        })

        console.log(body)

        refNewNumber.value = undefined
    }

    const enterAddingNumbersMode = () => {
        if (!modalData.value) return

        selectedYards.value[modalData.value.yardId] = true
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
        selectedYards.value = Object.fromEntries(userInfo.value.courtyards.map(({ id }) => [id, false]))
    })

</script>

<template>
    <div class="profile">
        <div class="content">
            <ContentBlock title="Мои дворы">
                <div class="courtyards">
                    <Modal v-model:show="modalIsOpen"
                           :title="addingNumberMode ? 'Добавление автомобиля' : modalData?.title"
                           :on-close="onModalClose"
                    >
                        <div v-if="!addingNumberMode" class="numbers-modal">
                            <button class="add-number-button" @click="enterAddingNumbersMode">
                                <PlusIcon color="#000000" />
                            </button>
                            <CarNumber :number="number" v-for="number in modalData?.numbers" :key="number" />
                        </div>

                        <div v-if="addingNumberMode" class="adding-numbers-modal">
                            <CarNumberInput v-model="refNewNumber"/>
                            <div class="address-row">
                                <CheckBox v-model="selectedYards[courtyard.id]"
                                          v-for="courtyard in userInfo.courtyards"
                                          :key="courtyard.id"
                                >
                                    {{courtyard.address}}
                                </CheckBox>
                            </div>
                        </div>

                        <template v-if="addingNumberMode" #buttons>
                            <Button accent
                                    :on-click="() => {
                                        addNumber()
                                        onModalClose()
                                    }"
                            >Добавить</Button>
                        </template>
                    </Modal>
                    <div class="courtyard" v-for="courtyard in userInfo.courtyards" :key="courtyard.id">
                        <Text color="#FFFFFF">{{ courtyard.address }}</Text>
                        <button class="manage-cars" @click="showModal(courtyard)">
                            <Text color="#3F88E4">Управление автомобилями</Text>
                            <RightArrowIcon color="#3F88E4"/>
                        </button>
                    </div>
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

        <Text>{{ t }}</Text>

        <footer class="footer">
            <Button :on-click="() => {}">Выйти</Button>
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

    .courtyard {
        display: flex;
        flex-direction: column;
        gap: 8px;
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
        gap: 8px;
        overflow: auto;
        scrollbar-width: none;

        .add-number-button {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 28px;
            min-width: 28px;
            background-color: #3F88E4;
            border-radius: 50%;
        }
    }

    .adding-numbers-modal {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .address-row {
            display: flex;
            gap: 8px;
            overflow: auto;
            scrollbar-width: none;
        }
    }

    .footer {
        display: flex;
        justify-content: end;
        width: 100%;
    }
</style>