/* global m */

import { get, del } from '../model/todo.mjs'

export default function (vnode) {
    const item = m.stream((vnode.attrs.key && get(vnode.attrs.key)) || {})
    const deleteEvent = () => del(item().id)
    return {
        item,
        deleteEvent
    }
}
