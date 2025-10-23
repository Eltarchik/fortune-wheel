<script setup lang="ts">

    import CarNumber from "./CarNumber.vue"
    import {computed} from "vue";

    interface Props {
        number: string
        fillingLevel?: number
        disabled?: boolean
    }

    const { number, fillingLevel = 100, disabled = false } = defineProps<Props>()

    const fillingPercent = computed<string>(() =>
        Math.min(Math.max(4, fillingLevel), 100).toString() + "%"
    )

</script>

<template>
    <div class="timeline">
        <CarNumber :number="number" class="number"/>
        <div class="track">
            <div class="strip" :class="{ disabled: disabled }"></div>
            <div class="circle">
                <div v-if="fillingLevel >= 100" class="full-indicator"></div>
            </div>
        </div>
        <slot />
    </div>
</template>

<style scoped lang="scss">

    .timeline {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .number {
        z-index: 5;
    }

    .track {
        position: relative;
        display: flex;
        align-items: center;
        height: 8px;
        width: 100%;
        margin-top: -4px;
        margin-right: 4px;
        border-radius: 4px;
        background-color: #000000CC;
        z-index: 1;

        .strip {
            height: 100%;
            width: v-bind(fillingPercent);
            border-radius: 4px;
            background-image: linear-gradient(#2FB8FF, #9EECD9);

            &.disabled {
                background-image: linear-gradient(#FFFFFF, #474747);
            }
        }

        .circle {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            right: -4px;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            border: 2px solid #FFFFFF;
        }

        .full-indicator {
            display: flex;
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background-image: linear-gradient(#9EECD9, #2FB8FF);
        }
    }

</style>