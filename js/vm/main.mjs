/* global m */

import { list, add, filter } from '../model/todo.mjs'

export default function (vnode) {
    const addEvent = e => {
        add(e.target.value)
        e.target.value = ''
        return e
    }

    return {
        list,
        addEvent,
        filter
    }
}
