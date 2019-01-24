/* global m, window */

const STORAGE_ID = 'todos-mvvm-frp-mithril'

const generateUniqueID = () => (new Date()).getTime()

export const list = JSON.parse(window.localStorage.getItem(STORAGE_ID) || '[]')

export const add = title => {
    list.push(
        {
            id: generateUniqueID(),
            title: title.trim(),
            completed: false
        }
    )
}
