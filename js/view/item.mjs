/* global m */

export default (vnode, vm) => ({
    view: vnode =>
        m(
            'li',
            {
                key: vm.item().id
            },
            [
                m('.view', [
                    m('input.toggle[type=checkbox]', {
                        checked: false
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
