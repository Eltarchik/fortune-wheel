import { defineStore } from 'pinia'

interface AuthState {
    userId: number | null
}

interface AuthActions {
    setUserId: (id: number) => void
    logout: () => void
}

export const useAuthStore = defineStore<"auth", AuthState, {}, AuthActions>('auth', {
    state: () => ({
        userId: null
    }),
    actions: {
        setUserId(id: number) {
            this.userId = id
        },
        logout() {
            this.userId = null
            localStorage.removeItem('id')
        }
    },
})