/* global m */

import { list, add } from '../model/todo.mjs'

export default function (vnode) {
    const addEvent = e => {
        add(e.target.value)
        e.target.value = ''
        return e
    }

    const filter = filter => item =>
        filter
            ? (filter === 'active' && item.completed === false) ||
              (filter === 'completed' && item.completed)
            : true

    return {
        list,
        addEvent,
        filter
    }
}
