export const validatePhone = (value: string) => {
    const phoneRegex = /^(?:\+7|8)9\d{9}$/
    return phoneRegex.test(value)
}