/* global m */

import { get, del, update } from '../model/todo.mjs'
import { compose } from '../lib.mjs'

export default function (vnode) {
    const item = m.stream((vnode.attrs.key && get(vnode.attrs.key)) || {})

    const deleteEvent = () => del(item().id)

    const completeEvent = () =>
        item(Object.assign({}, item(), { completed: !item().completed })) &&
        update(item())

    return {
        item,
        deleteEvent,
        completeEvent
    }
}
