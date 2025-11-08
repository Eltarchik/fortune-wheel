<script setup lang="ts">
    import Heading from "./Heading.vue"
    import Button from "./Button.vue"

    interface Props {
        show: Boolean
        title?: string
        hideButtons?: boolean
        onClose: () => void
    }

    const { show, title = "", hideButtons = false, onClose } = defineProps<Props>()

    const emit = defineEmits(['update:show'])

    const close = () => {
        emit('update:show', false)
        onClose?.()
    }
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="bg" @click.self="close">
            <div class="modal">
                <Heading v-if="title">{{title}}</Heading>
                <slot />
                <div v-if="!hideButtons" class="buttons">
                    <slot name="buttons"/>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped lang="scss">
    .bg {
        display: flex;
        height: 100vh;
        width: 100vw;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 0;
        top: 0;
        background-color: #00000075;
        backdrop-filter: blur(4px);
        z-index: 20;
    }

    .modal {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px;
        margin-inline: 20px;
        border-radius: 16px;
        width: 100%;
        background-color: #262626;
        overflow: auto;
    }
    .buttons {
        display: flex;
        gap: 16px;
        padding-top: 16px;
        justify-content: space-between;
    }
</style>