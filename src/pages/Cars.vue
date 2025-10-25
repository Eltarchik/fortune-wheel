<script setup lang="ts">

    import {ref} from "vue"
    import Guests from "./Guests.vue"
    import History from "./History.vue"

    enum CarsPageSection {
        GUESTS, HISTORY
    }

    interface Section {
        type: CarsPageSection
        title: string
    }

    const sections: Section[] = [
        { type: CarsPageSection.GUESTS, title: "Гости" },
        { type: CarsPageSection.HISTORY, title: "История" },
    ]

    const carsPageSection = ref<CarsPageSection>(CarsPageSection.GUESTS)

</script>

<template>
    <div class="sections-row">
        <button class="section" :class="{ selected: carsPageSection === section.type }"
                v-for="section in sections"
                :key="section.type"
                @click="() => {carsPageSection = section.type}"
        >
            {{section.title}}
        </button>
    </div>
    <Guests v-if="carsPageSection === CarsPageSection.GUESTS" />
    <History v-else-if="carsPageSection === CarsPageSection.HISTORY" />
</template>

<style scoped lang="scss">

    .sections-row {
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
        margin-top: 16px;
        height: 40px;
        width: fit-content;
        background-color: #262626;
        border-radius: 20px;
    }

    .section {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        padding-inline: 40px;
        border-radius: 20px;
        color: #FFFFFF;

        &.selected {
            background-color: #66D2EC;
            color: #000000;
        }
    }

</style>