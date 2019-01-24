/* global m, localstorage */

const STORAGE_ID = 'todos-mvvm-frp-mithril'

const generateUniqueID = () => new Date().getTime()

export const list = m.stream(
    JSON.parse(localStorage.getItem(STORAGE_ID) || '[]')
)

list.map(list => localStorage.setItem(STORAGE_ID, JSON.stringify(list)))

export const add = title => {
    if (!title.trim()) {
        return
    }
    list(
        list().concat({
            id: generateUniqueID(),
            title: title.trim(),
            completed: false
        })
    )
}

export const get = id => list().find(item => item.id === id)

export const del = id => {
    list(list().filter(item => item.id !== id))
}

export const update = item => {
    list(list().map(i => (i.id === item.id ? item : i)))
}

export const filter = filter => item =>
    filter
        ? (filter === 'active' && item.completed === false) ||
          (filter === 'completed' && item.completed)
        : true
