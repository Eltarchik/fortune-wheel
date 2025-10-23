import { defineStore } from 'pinia'

interface AuthState {
    token: string | null
}

interface AuthActions {
    setToken: (token: string) => void
    loadToken: () => void
    logout: () => void
}

export const useAuthStore = defineStore<"auth", AuthState, {}, AuthActions>('auth', {
    state: () => ({
        token: null
    }),
    actions: {
        setToken(token: string) {
            this.token = token
            localStorage.setItem('token', token)
        },
        loadToken() {
            this.token = localStorage.getItem('token')
        },
        logout() {
            this.token = null
            localStorage.removeItem('token')
        }
    },
})