/* global m */

export default (vnode, vm) => ({
    view: vnode =>
        m(
            'li',
            {
                key: '1'
            },
            [
                m('.view', [
                    m('input.toggle[type=checkbox]', {
                        checked: false
                    }),
                    m('label', vnode.attrs.title),
                    m('button.destroy')
                ]),
                m('input.edit', {
                    value: 'title'
                })
            ]
        )
})
