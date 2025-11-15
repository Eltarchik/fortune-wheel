import { Preferences } from "@capacitor/preferences"
import { Router } from "vue-router"
import { fetch } from "@tauri-apps/plugin-http"

interface Auth {
    id: number
    token: string
}

export const getAuthOrGotoAuth = async (router: Router) => {
    const id = (await Preferences.get({key: "user_id"})).value
    const token = (await Preferences.get({key: "access_token"})).value

    if (!id || !token) {
        await router.push("/auth")
        return
    }

    return { id: +id, token } as Auth
}

export const refreshTokenOrGotoAuth = async (router: Router) => {
    const refresh = (await Preferences.get({key: "refresh_token"})).value
    if (!refresh) {
        await router.push("/auth")
        return
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh: refresh
        })
    })

    if (!response.ok && response.status === 401) {
        await router.push("/auth")
        return
    }

    const token = (await response.json()).access
    await Preferences.set({ key: "access_token", value: token })
}

export const deleteAuth = async () => {
    await Preferences.remove({ key: 'access_token' })
    await Preferences.remove({ key: 'user_id' })
}

export const safeResponse = async (router: Router, fetch:(auth: Auth) => Promise<Response>, lastAttempt?: boolean): Promise<any> => {
    const auth = await getAuthOrGotoAuth(router)
    if (!auth) return

    const resp = await fetch(auth)
    if (!(resp.status === 401)) return await resp.json()

    if (!lastAttempt) {
        await refreshTokenOrGotoAuth(router)
        return await safeResponse(router, fetch, true)

    } else {
        await router.push("/auth")
    }
}

export const apiFetch = async (router: Router, url: string, init?: RequestInit): Promise<any> => {
    return safeResponse(router, (auth) => fetch(`${import.meta.env.VITE_API_BASE_URL}/${url}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`,
            ...init?.headers
        },
    }))
}