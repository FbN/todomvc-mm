/* global m */

export default (vnode, vm) => ({
    view: vnode =>
        m(
            'li',
            {
                key: vm.item().id,
                class: vm.item().completed ? 'completed' : ''
            },
            [
                m('.view', [
                    m('input.toggle[type=checkbox]', {
                        onclick: vm.completeEvent,
                        checked: vm.item().completed
                    }),
                    m('label', vm.item().title),
                    m('button.destroy', { onclick: vm.deleteEvent })
                ]),
                m('input.edit', {
                    value: 'title'
                })
            ]
        )
})
