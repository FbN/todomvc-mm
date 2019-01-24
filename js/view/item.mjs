/* global m */

import { compose, onEnter, onEsc } from '../lib.mjs'

export default (vnode, vm) => ({
    view: vnode =>
        m(
            'li',
            {
                key: vm.item().id,
                class:
                    (vm.item().completed ? 'completed' : '') +
                    (vm.editing() ? ' editing' : '')
            },
            [
                m('.view', [
                    m('input.toggle[type=checkbox]', {
                        onclick: vm.completeEvent,
                        checked: vm.item().completed
                    }),
                    m(
                        'label',
                        { ondblclick: vm.editingEvent },
                        vm.item().title
                    ),
                    m('button.destroy', { onclick: vm.deleteEvent })
                ]),
                m('input.edit', {
                    onkeyup: compose(
                        onEsc(vm.cancelEditingEvent),
                        vm.editTextEvent,
                        onEnter(vm.confirmEditingEvent)
                    ),
                    onupdate: vnode => vm.editing() && vnode.dom.focus(),
                    onblur: vm.confirmEditingEvent,
                    value: vm.editingText()
                })
            ]
        )
})
