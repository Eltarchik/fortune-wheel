<script setup lang="ts">
import Heading, {HeadingSize} from "./Heading.vue"
    import Text from "./Text.vue"

    interface Props {
        number: string
        large?: boolean
    }

    const { number, large = false } = defineProps<Props>()

    const mainNumber = number.slice(0, 6)
    const subNumber = number.slice(6)
</script>

<template>
    <div class="card" :class="large && 'large'">
        <Heading color="#000000" :size="large ? HeadingSize.LARGE : HeadingSize.MEDIUM">
            {{ mainNumber }}
        </Heading>
        <Text v-if="subNumber && !large" color="#000000" class="region">{{ subNumber }}</Text>
        <Heading v-if="subNumber && large" :size="HeadingSize.MEDIUM" color="#000000" class="region">
            {{ subNumber }}
        </Heading>
    </div>
</template>

<style scoped lang="scss">

    .card {
        display: flex;
        gap: 4px;
        padding: 1px 8px;
        width: 128px;
        height: 28px;
        background-color: #D9D9D9;
        border-radius: 4px;

        &.large {
            padding: 0 12px;
            width: 200px;
            height: 40px;
            border-radius: 8px;
            justify-content: center;
        }
    }

    .region {
        padding-top: 2px;
    }

</style>