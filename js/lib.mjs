export const compose = (...functions) => args =>
    functions.reduceRight((arg, fn) => fn(arg), args)

const ENTER_KEY = 13
const ESC_KEY = 27

const onKeyCode = (keyCode, callback) => e => {
    e.keyCode === keyCode && callback(e)
    return e
}

export const onEnter = callback => onKeyCode(ENTER_KEY, callback)

export const onEsc = callback => onKeyCode(ESC_KEY, callback)
