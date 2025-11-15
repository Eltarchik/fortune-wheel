<script setup lang="ts">

    import TextInput from "../components/inputs/BasicInput.vue"
    import ContentBlock from "../components/ContentBlock.vue"
    import TimelineWithNumber from "../components/TimelineWithNumber.vue"
    import {computed, onMounted, ref} from "vue"
    import Text from "../components/Text.vue"
    import RightArrowIcon from "../icons/RightArrowIcon.vue"
    import Modal from "../components/Modal.vue"
    import {formatDayLabel, formatTime} from "../utils/DateAndTime.ts"
    import {getAuthOrGotoAuth, safeResponse} from "../utils/Auth.ts";
    import {useRouter} from "vue-router";
    import { fetch } from "@tauri-apps/plugin-http"
    import {HistoryEntry, Yard} from "../types/api/Yard.ts";

    interface CarActionsEntry {
        carNumber: string
        entry: string | null
        exit: string | null
    }

    interface EntriesWithDay {
        day: string // yyyy-mm-dd
        entries: CarActionsEntry[]
    }

    const router = useRouter()

    const daysHistory = ref<EntriesWithDay[]>([])

    const yards = ref<Yard[]>([])
    const selectedYardId = ref<number>(0)

    const searchText = ref<string>("")

    const fetchHistory = (token: string): Promise<Response> => {
        return fetch(`${import.meta.env.VITE_API_BASE_URL}/yard/user-history/`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    }

    const showYardsModal = ref<boolean>(false)

    const filteredDaysHistory = computed(() => {
        if (!searchText.value.trim()) return daysHistory.value

        const query = searchText.value.trim().toLowerCase()

        return daysHistory.value
            .map(day => {
                const filteredEntries = day.entries.filter(entry =>
                    entry.carNumber.toLowerCase().includes(query)
                )
                return { ...day, entries: filteredEntries }
            })
            .filter(day => day.entries.length > 0)
    })

    onMounted(async () => {
        const token = (await getAuthOrGotoAuth(router))?.token
        if (!token) return

        const history = await safeResponse(router, (auth) => fetchHistory(auth.token)) as HistoryEntry[]

        history.forEach(entry => {
            if (!yards.value
                .map(yard => yard.id)
                .includes(entry.yard.id)
            ) {
                yards.value.push(entry.yard)
            }
        })

        selectedYardId.value = yards.value[0]?.id || 0

        await loadHistory()
    })

    const loadHistory = async () => {
        const token = (await getAuthOrGotoAuth(router))?.token
        if (!token) return

        const history = await safeResponse(router, (auth) => fetchHistory(auth.token)) as HistoryEntry[]
        const filteredHistory = history.filter(entry => entry.yard.id === selectedYardId.value)

        const byDay: Record<string, HistoryEntry[]> = {}
        for (const entry of filteredHistory) {
            const day = entry.created_at.slice(0, 10)
            if (!byDay[day]) byDay[day] = []
            byDay[day].push(entry)
        }

        const result: EntriesWithDay[] = []

        for (const [day, dayEntries] of Object.entries(byDay)) {
            dayEntries.sort((a, b) => {
                const nameDiff = a.auto_number.localeCompare(b.auto_number)
                if (nameDiff !== 0) return nameDiff
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            })

            const actions: CarActionsEntry[] = []

            const byCar: Record<string, HistoryEntry[]> = {}
            for (const e of dayEntries) {
                const num = e.auto_number
                if (!byCar[num]) byCar[num] = []
                byCar[num].push(e)
            }

            for (const [carNum, events] of Object.entries(byCar)) {
                events.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

                let i = 0
                while (i < events.length) {
                    const e = events[i]
                    if (e.event_type === "entry") {
                        const pairIndex = events.findIndex(
                            (p, idx) =>
                                idx > i &&
                                p.event_type === "exit" &&
                                new Date(p.created_at).getTime() > new Date(e.created_at).getTime()
                        )

                        if (pairIndex !== -1) {
                            actions.push({
                                carNumber: carNum,
                                entry: e.created_at,
                                exit: events[pairIndex].created_at,
                            })
                            events.splice(pairIndex, 1) // удаляем использованный exit
                        } else {
                            actions.push({
                                carNumber: carNum,
                                entry: e.created_at,
                                exit: null,
                            })
                        }
                    } else if (e.event_type === "exit") {
                        actions.push({
                            carNumber: carNum,
                            entry: null,
                            exit: e.created_at,
                        })
                    }
                    i++
                }
            }

            result.push({ day, entries: actions })
        }

        result.sort((a, b) => (a.day > b.day ? 1 : -1))

        daysHistory.value = result
    }

    const openYardsModal = () => {
        showYardsModal.value = true
    }

    const onYardsModalClose = () => {
        loadHistory()
        showYardsModal.value = false
    }

</script>

<template>
    <div class="history">
        <Modal v-model:show="showYardsModal" :on-close="onYardsModalClose">
            <div class="yards">
                <button v-for="yard in yards"
                        :key="yard.id"
                        @click="() => { selectedYardId = yard.id }"
                >
                    <Text :color="yard.id === selectedYardId ? '#3F88E4' : '#FFFFFF'">
                        {{yard.address}}
                    </Text>
                </button>
            </div>
        </Modal>
        <button class="yard"
                @click="openYardsModal"
        >
            <Text color="#999999">{{yards.find(yard => yard.id === selectedYardId)?.address}}</Text>
            <RightArrowIcon color="#999999"/>
        </button>
        <TextInput placeholder="Поиск по номеру" v-model="searchText" />
        <div class="days">
            <ContentBlock :title="formatDayLabel(dayHistory.day)" v-for="dayHistory in filteredDaysHistory" :key="dayHistory.day">
                <div class="entries">
                    <TimelineWithNumber :number="entry.carNumber" v-for="entry in dayHistory.entries">
                        <div class="times">
                            <Text color="#FFFFFF">{{ formatTime(entry.entry || "") }}</Text>
                            <Text color="#FFFFFF">{{ formatTime(entry.exit || "") }}</Text>
                        </div>
                    </TimelineWithNumber>
                </div>
            </ContentBlock>
        </div>
    </div>
</template>

<style scoped lang="scss">

    .history {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-inline: 20px;
        padding-bottom: 40px;
    }

    .yards {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px
    }

    .yard {
        display: flex;
        gap: 4px;
        align-items: center;
        align-self: center;
        margin-block: 16px;
    }

    .days {
        display: flex;
        flex-direction: column-reverse;
        gap: 20px;
        margin-top: 20px;
    }

    .entries {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    .times {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        width: 100%;
    }

</style>