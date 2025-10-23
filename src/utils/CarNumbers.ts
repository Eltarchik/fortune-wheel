export const validateNumber = (number: string) => {
    const mask = /^[A-Z][0-9]{3}[A-Z]{2}[0-9]{1,3}$/i

    return mask.test(number.toUpperCase())
}