/* global m */

import { list, add, filter } from '../model/todo.mjs'

export default function (vnode) {
    const addEvent = e => {
        add(e.target.value)
        e.target.value = ''
        return e
    }

    const isAllCompleted = () => !list().filter(filter('active')).length

    const completeAllEvent = () =>
        list(
            list().map(task =>
                Object.assign({}, task, { completed: !isAllCompleted() })
            )
        )

    return {
        list,
        addEvent,
        filter,
        isAllCompleted,
        completeAllEvent
    }
}
