<script setup lang="ts">

    interface AppSection {
        title: string
        name: string
        href: string
    }

    const appSections: AppSection[] = [
        {
            title: "Автомобили",
            name: "cars",
            href: "/cars"
        },
        {
            title: "Аккаунт",
            name: "profile",
            href: "/profile"
        }
    ]

</script>

<template>
    <header class="header">
        <nav class="navbar">
            <RouterLink :to="section.href" v-for="section in appSections">
                <h1 class="section" :class="{ selected: $route.path === section.href }">
                    {{ section.title }}
                </h1>
            </RouterLink>
        </nav>
    </header>
</template>

<style lang="scss" scoped>
    .navbar {
        display: flex;
        gap: 24px;
        padding-inline: 20px;
        overflow: auto;
        scrollbar-width: none;
    }

    .section {
        color: #999999;
        text-align: center;
        font-size: 44px;
        font-weight: 700;

        &.selected {
            color: #FFFFFF;
        }
    }
</style>