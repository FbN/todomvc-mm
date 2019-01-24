/* global m */

import { itemComponent } from '../components.mjs'

import { compose } from '../lib.mjs'

const ENTER_KEY = 13
const ESC_KEY = 27

const onKeyCode = (keyCode, callback) => e => {
    e.keyCode === keyCode && callback(e)
    return e
}

export default (vnode, vm) => ({
    view: vnode => [
        m('header.header', [
            m('h1', 'todos'),
            m('input.new-todo[placeholder="What needs to be done?"]', {
                onkeyup: compose(
                    onKeyCode(ENTER_KEY, e => vm.add(e.target.value)),
                    onKeyCode(ESC_KEY, e => console.log('esc'))
                )
            })
        ]),
        m(
            'section.main',
            {
                style: {
                    display: 'block'
                }
            },
            [
                m('input#toggle-all.toggle-all[type=checkbox]', {
                    checked: false
                }),
                m('label', {
                    for: 'toggle-all'
                }),
                m(
                    'ul.todo-list',
                    vm.list.map(task => m(itemComponent, { ...task }))
                )
            ]
        ),
        '' // footer
    ]
})
