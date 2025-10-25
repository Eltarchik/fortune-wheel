export const validateNumber = (number: string) => {
    const mask = /^[A-ZА-Я][0-9]{3}[A-ZА-Я]{2}[0-9]{1,3}$/i

    return mask.test(number.toUpperCase())
}