import { m } from '../vendor.mjs'

export default function itemView (
    { item, editing, editingText },
    {
        _$keyup,
        _$input,
        _$complete,
        _$editing,
        _$delete,
        _$confirmEditing
    },
    vnodeR
) {
    return m(
        'li',
        {
            key: item.id,
            class:
                (item.completed ? 'completed' : '') +
                (editing ? ' editing' : '')
        },
        [
            m('.view', [
                m('input.toggle[type=checkbox]', {
                    onclick: _$complete,
                    checked: item.completed
                }),
                m('label', { ondblclick: _$editing }, item.title),
                m('button.destroy', { onclick: _$delete })
            ]),
            m('input.edit', {
                onkeydown: _$keyup,
                oninput: _$input,
                onupdate: vnode => editing && vnode.dom.focus(),
                onblur: e => editing && _$confirmEditing(e),
                value: editingText
            })
        ]
    )
}
