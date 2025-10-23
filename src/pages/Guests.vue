<script setup lang="ts">

    import Text from "../components/Text.vue"
    import PlusIcon from "../icons/PlusIcon.vue"
    import ContentBlock from "../components/ContentBlock.vue"
    import TimelineWithNumber from "../components/TimelineWithNumber.vue"
    import {computed, onMounted, ref} from "vue"
    import {Guest, GuestsData} from "../types/api/Guests.ts"
    import Modal from "../components/Modal.vue"
    import Button from "../components/Button.vue"
    import CarNumberInput from "../components/CarNumberInput.vue"
    import {UserData} from "../types/api/UserData.ts"
    import CheckBox from "../components/CheckBox.vue"
    import {useAuthStore} from "../stores/auth.ts"

    interface Yard {
        address: string
        id: number
    }

    const mockUserId = 3

    const currentGuests = ref<Guest[]>([])
    const currentTime = ref<Date>(new Date())

    const yards = ref<Yard[]>([])

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
        const guestsResponse =
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/current-guests/?invite_by_id=${mockUserId}`)
        const guestsData: GuestsData = await guestsResponse.json()

        currentGuests.value = guestsData.active_guests
        currentTime.value = new Date(guestsData.current_time)

        const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/account/${mockUserId}/`)
        const userData: UserData = await userResponse.json()

        yards.value = Object
            .entries(userData.addresses)
            .map(([address, _], i) => ({
                address,
                id: i
            }))

        if (!yards.value.length) return
        yardsCheckboxValues.value = Object.fromEntries(yards.value.map(({ id }) => [id, false]))
        yardsCheckboxValues.value[yards.value[0].id] = true
    })

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
        yardsCheckboxValues.value[yards.value[0].id] = true
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

        console.log(entryTimeout.getTime())

        const auth = useAuthStore()

        const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/create-guestentry/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                guest_auto_number: newGuestNumber.value,
                yard_id: 2,
                entry_timeout: entryTimeout.toISOString()
            })
        })

        console.log(r)
    }

</script>

<template>
    <div class="guests">
        <Modal title="" v-model:show="showModal" :on-close="onModalClose">
            <CarNumberInput v-model="newGuestNumber"/>
            <div class="address-row">
                <CheckBox v-model="yardsCheckboxValues[yard.id]"
                          v-for="yard in yards"
                          :key="yard.id"
                          @change="() => {
                              resetYardsCheckboxValues()
                              yardsCheckboxValues[yard.id] = true
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
                <Button accent
                        :on-click="() => {
                            addGuest()
                            onModalClose()
                        }"
                >Добавить</Button>
            </template>
        </Modal>
        <button class="add-guest"
                @click="openModal"
        >
            <Text color="#3F88E4">Добавить гостя</Text>
            <PlusIcon color="#3F88E4"/>
        </button>
        <ContentBlock title="Активные">
            <div class="active-guests">
                <TimelineWithNumber number="A123BC52" v-for="guest in currentGuests" :key="guest.id">
                    <Text v-if="guest.entry_timeout" class="timeline-entry-text">
                        Осталось {{ getRemainingTime(guest.entry_timeout) }} ({{ guest.yard_address }})
                    </Text>
                    <Text v-else class="timeline-entry-text">Уже во дворе ({{ guest.yard_address }})</Text>
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

    .add-guest {
        display: flex;
        gap: 4px;
        align-items: center;
        align-self: center;
        margin-block: 16px;
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