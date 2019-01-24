/* global m */

import { list, add } from '../model/todo.mjs'

export default function (vnode) {
    
    const addEvent = e => {
        add(e.target.value)
        e.target.value = ''
        return e
    }
    
    return {
        list,
        addEvent
    }
}
