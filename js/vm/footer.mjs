/* global m */

import { list, filter, del } from '../model/todo.mjs'

export default function (vnode) {
    const clearEvent = e =>
        list()
            .filter(filter('completed'))
            .map(item => del(item.id))
            
    const itemLeft = () =>
        list()
            .filter(filter('active'))
            .length

    return {
        list,
        filter,
        clearEvent,
        itemLeft
    }
}
