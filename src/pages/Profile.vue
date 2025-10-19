<script setup lang="ts">
    import ContentBlock from "../components/ContentBlock.vue"
    import Heading, {HeadingSize} from "../components/Heading.vue"
    import Text from "../components/Text.vue"
    import Modal from "../components/Modal.vue"
    import {onMounted, ref} from "vue"
    import CarNumber from "../components/CarNumber.vue"
    import {UserData} from "../types/api/UserData.ts"
    import RightArrowIcon from "../icons/RightArrowIcon.vue";
    import PlusIcon from "../icons/PlusIcon.vue";
    import Button from "../components/Button.vue";

    interface UserParam {
        title: string
        content: string
    }

    interface Courtyard {
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
        title: string
        numbers: string[]
    }

    let modalIsOpen = ref<boolean>(false)
    let modalData = ref<ModalData | null>(null)

    const showModal = (courtyard: Courtyard) => {
        modalData.value = {
            title: courtyard.address,
            numbers: courtyard.carNumbers
        }
        modalIsOpen.value = true
    }

    const onModalClose = () => {
        modalIsOpen.value = false
        modalData.value = null
    }

    onMounted(async () => {
        const mockUserId = 3
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/account/${mockUserId}/`)
        const userData: UserData = await response.json()

        userInfo.value.name.content = userData.name || "Не указано"
        userInfo.value.phone.content = userData.phone || "Не указан"
        userInfo.value.courtyards = Object
            .entries(userData.addresses)
            .map(([address, carNumbers]) => ({
                address,
                carNumbers
            }))
    })

</script>

<template>
    <div class="profile">
        <div class="content">
            <ContentBlock title="Мои дворы">
                <div class="courtyards">
                    <Modal v-model:show="modalIsOpen" :title="modalData?.title" :on-close="onModalClose">
                        <div class="modal">
                            <button class="add-number-button">
                                <PlusIcon color="#000000" />
                            </button>
                            <CarNumber :number="number" v-for="number in modalData?.numbers"/>
                        </div>
                    </Modal>
                    <div class="courtyard" v-for="courtyard in userInfo.courtyards">
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
                    <div class="info-item" v-for="param in [userInfo.name, userInfo.phone]">
                        <Heading>{{param.title}}</Heading>
                        <Text>{{param.content}}</Text>
                    </div>
                </div>
            </ContentBlock>
        </div>

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

    .modal {
        display: flex;
        gap: 8px;

        .add-number-button {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 28px;
            width: 28px;
            background-color: #3F88E4;
            border-radius: 50%;
        }
    }

    .footer {
        display: flex;
        justify-content: end;
        width: 100%;
    }
</style>