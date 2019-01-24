/* global m */

import { itemComponent } from '../components.mjs'
import { footerComponent } from '../components.mjs'
import { compose, onEnter, onEsc } from '../lib.mjs'

export default (vnode, vm) => ({
    view: vnode => [
        m('header.header', [
            m('h1', 'todos'),
            m('input.new-todo[placeholder="What needs to be done?"]', {
                autofocus: true,
                onkeyup: compose(
                    onEnter(vm.addEvent),
                    onEsc(e => (e.target.value = ''))
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
                vm.list().length > 0
                    ? m('input#toggle-all.toggle-all[type=checkbox]', {
                        checked: vm.isAllCompleted,
                        onclick: vm.completeAllEvent
                    })
                    : '',
                m('label', {
                    for: 'toggle-all'
                }),
                m(
                    'ul.todo-list',
                    vm
                        .list()
                        .filter(vm.filter(m.route.param('filter')))
                        .map(task => m(itemComponent, { key: task.id }))
                )
            ]
        ),
        m(footerComponent)
    ]
})
