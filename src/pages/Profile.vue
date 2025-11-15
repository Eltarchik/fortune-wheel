<script setup lang="ts">
    import ContentBlock from "../components/ContentBlock.vue"
    import Heading from "../components/Heading.vue"
    import Text from "../components/Text.vue"
    import Modal from "../components/Modal.vue"
    import {onMounted, ref} from "vue"
    import CarNumber from "../components/CarNumber.vue"
    import {AddressData, UserData} from "../types/api/UserData.ts"
    import RightArrowIcon from "../icons/RightArrowIcon.vue"
    import PlusIcon from "../icons/PlusIcon.vue"
    import CarNumberInput from "../components/CarNumberInput.vue"
    import BasicButton from "../components/BasicButton.vue"
    import {validateNumber} from "../utils/CarNumbers.ts"
    import {useRouter} from "vue-router"
    import {apiFetch, deleteAuth, getAuthOrGotoAuth} from "../utils/Auth.ts"
    import {Invite} from "../types/api/Invite.ts";
    import {Yard} from "../types/api/Yard.ts";

    interface UserParam {
        title: string
        content: string
    }

    interface UserInfo {
        name: UserParam
        phone: UserParam
        courtyards: AddressData[]
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

    const invites = ref<Invite[]>([])

    interface ModalData {
        yardId: number
        title: string
        numbers: string[]
    }

    const router = useRouter()

    const modalIsOpen = ref<boolean>(false)
    const addingNumberMode = ref<boolean>(false)
    const modalData = ref<ModalData | null>(null)

    const refNewNumber = ref<string | undefined>(undefined)

    const showModal = async (yard: AddressData) => {
        modalData.value = {
            yardId: yard.yard_id,
            title: yard.address,
            numbers: await getCarNumbers(yard.yard_id)
        }
        modalIsOpen.value = true
    }

    const getCarNumbers = async (yardId: number) => {
        const data = await apiFetch(router, `yard/user-auto/?yard_id=${yardId}`)
        return data.automobiles as string[]
    }

    const onModalClose = () => {
        modalIsOpen.value = false
        addingNumberMode.value = false
        modalData.value = null
    }

    const addNumber = async () => {
        if (!refNewNumber.value || !validateNumber(refNewNumber.value) || ! modalData.value) return

        const userId = (await getAuthOrGotoAuth(router))?.id
        if (!userId) return

        const body = JSON.stringify({
            auto_number: refNewNumber.value,
            yard_id: [modalData.value.yardId]
        })

        await apiFetch(router, "yard/add-auto/", { method: "POST", body })

        addingNumberMode.value = false
        modalData.value.numbers.push(refNewNumber.value)
        refNewNumber.value = undefined
    }

    const enterAddingNumbersMode = () => {
        if (!modalData.value) return
        addingNumberMode.value = true
    }

    const logout = async () => {
        await deleteAuth()

        await router.push('/auth')
    }

    const acceptInvite = async (yard: Yard) => {
        const body = JSON.stringify({
            type: "accept",
            yard_id: yard.id
        })

        const resp = await reactInvite(body)
        if (resp.error) return

        userInfo.value.courtyards.push({
            address: yard.address,
            yard_id: yard.id
        })

        invites.value = invites.value.filter(invite => invite.yard.id !== yard.id)
    }

    const rejectInvite = async (yard: Yard) => {
        const body = JSON.stringify({
            type: "reject",
            yard_id: yard.id
        })
        await reactInvite(body)

        invites.value = invites.value.filter(invite => invite.yard.id !== yard.id)
    }

    const reactInvite = async (body: string) => {
        return await apiFetch(router, "yard/invites/", { method: "POST", body }) as { error?: "" }
    }

    onMounted(async () => {
        const userData: UserData = await apiFetch(router, "users/account/")

        userInfo.value.name.content = userData.name || "Не указано"
        userInfo.value.phone.content = userData.phone || "Не указан"
        userInfo.value.courtyards = userData.addresses

        invites.value = await apiFetch(router, "yard/invites/")
    })

</script>

<template>
    <div class="profile">
        <div class="content">
            <ContentBlock title="Мои дворы">
                <div class="courtyards">
                    <Modal :show="modalIsOpen"
                           :on-close="onModalClose"
                    >
                        <div class="numbers-modal">
                            <button v-if="!addingNumberMode" class="add-number" @click="enterAddingNumbersMode">
                                <PlusIcon color="#000000" size="32" />
                            </button>
                            <div v-if="addingNumberMode" class="add-number-form">
                                <CarNumberInput v-model="refNewNumber" class="add-number-input"/>
                                <button class="add-number-button" @click="addNumber">
                                    <PlusIcon color="#000000" size="32" />
                                </button>
                            </div>
                            <CarNumber :number="number" large v-for="number in [...(modalData?.numbers || [])].reverse()" :key="number" />
                        </div>
                    </Modal>
                    <button v-for="courtyard in userInfo.courtyards" :key="courtyard.yard_id"
                            class="manage-cars"
                            @click="showModal(courtyard)"
                    >
                        <Text color="#3F88E4">{{ courtyard.address }}</Text>
                        <RightArrowIcon color="#3F88E4"/>
                    </button>
                    <div class="invite" v-for="invite in invites" :key="invite.id">
                        <div class="text">
                            <Text color="#FFFFFF">{{ invite.yard.address }}</Text>
                            <div class="point"></div>
                        </div>
                        <div class="buttons">
                            <BasicButton small accent @click="acceptInvite(invite.yard)">Принять</BasicButton>
                            <BasicButton small @click="rejectInvite(invite.yard)">Отклонить</BasicButton>
                        </div>
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

        <footer class="footer">
            <BasicButton @click="logout">Выйти</BasicButton>
        </footer>
    </div>
</template>

<style scoped>
    .profile {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
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

    .invite {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .text {
            display: flex;
            gap: 8px;

            .point {
                display: flex;
                height: 6px;
                width: 6px;
                background-color: #FF0000;
                border-radius: 50%;
            }
        }

        .buttons {
            display: flex;
            gap: 12px;
        }
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
        flex-direction: column;
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
            min-height: 40px;
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