/* global m */

import { get, del, update } from '../model/todo.mjs'
import { compose } from '../lib.mjs'

export default function (vnode) {
    const item = m.stream((vnode.attrs.key && get(vnode.attrs.key)) || {})
    const editing = m.stream(false)
    const editingText = m.stream(item().title)
    const deleteEvent = () => del(item().id)

    const completeEvent = () =>
        item(Object.assign({}, item(), { completed: !item().completed })) &&
        update(item())

    const editingEvent = () => editing(!editing())

    const cancelEditingEvent = e => {
        editingText(item().title)
        editing(false)
        return false
    }

    const editTextEvent = e => {
        editingText(e.target.value)
        return e
    }

    const confirmEditingEvent = e => {
        item(Object.assign({}, item(), { title: editingText() }))
        update(item())
        editing(false)
    }

    return {
        item,
        editing,
        editingText,
        deleteEvent,
        completeEvent,
        editingEvent,
        cancelEditingEvent,
        editTextEvent,
        confirmEditingEvent
    }
}
