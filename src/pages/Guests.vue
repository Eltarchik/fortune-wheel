<script setup lang="ts">

    import Text from "../components/Text.vue"
    import PlusIcon from "../icons/PlusIcon.vue"
    import ContentBlock from "../components/ContentBlock.vue"
    import TimelineWithNumber from "../components/TimelineWithNumber.vue"
    import {computed, onMounted, ref} from "vue"
    import {Guest, GuestsData} from "../types/api/Guests.ts"
    import Modal from "../components/Modal.vue"
    import BasicButton from "../components/BasicButton.vue"
    import CarNumberInput from "../components/CarNumberInput.vue"
    import {AddressData, UserData} from "../types/api/UserData.ts"
    import CheckBox from "../components/CheckBox.vue"
    import {safeResponse} from "../utils/Auth.ts";
    import {useRouter} from "vue-router";
    import { fetch } from "@tauri-apps/plugin-http"

    interface GuestData {
        id: number
        carNumber: string
        yardAddress: string
        timeLeft: string
        timelinePercent: number
        alreadyInYard: boolean
    }

    const router = useRouter()

    const currentGuestsData = ref<GuestData[]>([])
    const currentTime = ref<Date>(new Date())

    const yards = ref<AddressData[]>([])

    const showModal = ref<boolean>(false)
    const newGuestNumber = ref<string | undefined>(undefined)

    const yardsCheckboxValues = ref<Record<number, boolean>>({})
    const guestYardId = computed<number | null>(() => {
        for (const id in yardsCheckboxValues.value) {
            if (yardsCheckboxValues.value[+id]) return +id
        }
        return null
    })

    const timeToEnter = ref<string>("01:00")

    onMounted(async () => {
        const guestsData: GuestsData = await safeResponse(router, (auth) =>
            fetch(`${import.meta.env.VITE_API_BASE_URL}/users/current-guests/`, {
                headers: {
                    "Authorization": `Bearer ${auth.token}`
                }
            })
        )

        currentGuestsData.value = guestsData.active_guests.map(guest => ({
            id: guest.id,
            carNumber: guest.guest_auto_number,
            yardAddress: guest.yard_address,
            alreadyInYard: guest.enter_time !== null,
            timeLeft: getRemainingTime(guest.entry_timeout!),
            timelinePercent: getTimelinePercent(guest.created_at, guest.entry_timeout!)
        }))

        currentTime.value = new Date(guestsData.current_time)

        const userData: UserData = await safeResponse(router, (auth) => fetch(`${import.meta.env.VITE_API_BASE_URL}/users/account/`, {
            headers: {
                "Authorization": `Bearer ${auth.token}`
            }
        }))

        yards.value = userData.addresses

        if (!yards.value.length) return
        yardsCheckboxValues.value = Object.fromEntries(yards.value.map(({ yard_id }) => [yard_id, false]))
        yardsCheckboxValues.value[yards.value[0].yard_id] = true
    })

    const getTimelinePercent = (startTimeString: string, endTimeString: string): number => {
        const start = new Date(startTimeString)
        const end = new Date(endTimeString)
        const now = new Date()

        const timelineLength = end.getTime() - start.getTime()
        const filledTimelineLength = now.getTime() - start.getTime()

        return Math.round(100 / timelineLength * filledTimelineLength)
    }

    const getRemainingTime = (targetTimeString: string) => {
        const target = new Date(targetTimeString)

        let diff = target.getTime() - currentTime.value.getTime()
        if (diff <= 0) return "00:00"

        const hours = Math.floor(diff / (1000 * 60 * 60))
        diff -= hours * 1000 * 60 * 60

        const minutes = Math.floor(diff / (1000 * 60))

        const pad = (n: number) => n.toString().padStart(2, "0")
        return `${pad(hours)}:${pad(minutes)}`
    }

    const resetYardsCheckboxValues = () => {
        for (const id in yardsCheckboxValues.value) {
            yardsCheckboxValues.value[+id] = false
        }
    }

    const openModal = () => {
        showModal.value = true

        if (!yards.value.length) return
        yardsCheckboxValues.value[yards.value[0].yard_id] = true
    }

    const onModalClose = () => {
        showModal.value = false
        newGuestNumber.value = undefined

        resetYardsCheckboxValues()
    }

    const addGuest = async () => {

        if (!newGuestNumber.value || guestYardId.value === null) return

        const [hours, minutes] = timeToEnter.value.split(":").map(Number)
        const entryTimeout = new Date()

        entryTimeout.setHours(entryTimeout.getHours() + hours)
        entryTimeout.setMinutes(entryTimeout.getMinutes() + minutes)

        const body = JSON.stringify({
            guest_auto_number: newGuestNumber.value,
            yard_id: guestYardId.value,
            entry_timeout: entryTimeout.toISOString()
        })

        const data: Guest = await safeResponse(router, (auth) => fetch(`${import.meta.env.VITE_API_BASE_URL}/users/create-guestentry/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
            body
        }))

        currentGuestsData.value.push({
            id: data.id,
            carNumber: data.guest_auto_number,
            yardAddress: data.yard_address,
            alreadyInYard: data.enter_time !== null,
            timeLeft: getRemainingTime(data.entry_timeout!),
            timelinePercent: getTimelinePercent(data.created_at, data.entry_timeout!)
        })
    }

</script>

<template>
    <div class="guests">
        <Modal title="" v-model:show="showModal" :on-close="onModalClose">
            <CarNumberInput class="guest-car-number-input" v-model="newGuestNumber"/>
            <div class="address-row">
                <CheckBox v-model="yardsCheckboxValues[yard.yard_id]"
                          v-for="yard in yards"
                          :key="yard.yard_id"
                          @change="() => {
                              resetYardsCheckboxValues()
                              yardsCheckboxValues[yard.yard_id] = true
                          }"
                >
                    {{yard.address}}
                </CheckBox>
            </div>
            <div class="set-length">
                <Text color="#FFFFFF">Разрешить въезд на</Text>
                <label>
                    <input class="time-input" type="time" v-model="timeToEnter"/>
                </label>
            </div>

            <template #buttons>
                <BasicButton accent class="add-guest-button"
                        @click="async () => {
                            await addGuest()
                            onModalClose()
                        }"
                >Добавить</BasicButton>
            </template>
        </Modal>
        <button class="open-add-guest-modal"
                @click="openModal"
        >
            <Text color="#3F88E4">Добавить гостя</Text>
            <PlusIcon color="#3F88E4"/>
        </button>
        <ContentBlock title="Активные">
            <div class="active-guests">
                <TimelineWithNumber :number="guest.carNumber" :filling-level="guest.timelinePercent" v-for="guest in currentGuestsData" :key="guest.id">
                    <Text v-if="!guest.alreadyInYard" class="timeline-entry-text" color="#84EAF6">
                        {{ guest.yardAddress }}
                    </Text>
                    <Text v-if="!guest.alreadyInYard" class="timeline-entry-text">
                        Осталось {{ guest.timeLeft }}
                    </Text>
                    <Text v-else class="timeline-entry-text">Уже во дворе ({{ guest.yardAddress }})</Text>
                </TimelineWithNumber>
            </div>
        </ContentBlock>
    </div>
</template>

<style scoped lang="scss">

    .guests {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-inline: 20px;
    }

    .open-add-guest-modal {
        display: flex;
        gap: 4px;
        align-items: center;
        align-self: center;
        margin-block: 16px;
    }

    .add-guest-button {
        width: 100%;
    }

    .active-guests {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }

    .timeline-entry-text {
        margin-top: 8px;
    }

    .guest-car-number-input {
        width: 100%;
    }

    .address-row {
        display: flex;
        gap: 16px;
        overflow: auto;
        scrollbar-width: none;
    }

    .set-length {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .time {
        color: #999999;
    }

    .time-input {
        color: #FFFFFF;

        &::-webkit-calendar-picker-indicator {
            filter: invert(1);
        }
    }

</style>