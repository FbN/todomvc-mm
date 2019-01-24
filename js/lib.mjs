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

export const deepSeal = o => {
  Object.keys(o).forEach(key => {
    if (!Array.isArray(o[key]) && typeof o[key] === 'object' && o[key] !== null)
      o[key] = deepSeal(o[key])
  })
  return Object.seal(o)
}

export const deepFreezeCopy = o => 
  Object.freeze(
    Object.keys(o).reduce((acc, key) => (
     acc[key] = typeof o[key] === 'object' && o[key] !== null
        ? deepFreezeCopy(o[key])
        : o[key] instanceof Date
        ? new Date(o[key])
        : o[key],
      acc
    ), Array.isArray(o) ? [] : {})
  )
