import { m, M } from '../vendor.mjs'

import { list, get, del, update } from '../model/todo.mjs'

export default function itemVM ({ $oninit, $onupdate }, vnodeR) {
    const [_$keyup, $keyup] = M.createAdapter()
    const [_$complete, $complete] = M.createAdapter()
    const [_$editing, $editing] = M.createAdapter()
    const [_$delete, $delete] = M.createAdapter()
    const [_$cancelEditing, $cancelEditing] = M.createAdapter()
    const [_$confirmEditing, $confirmEditing] = M.createAdapter()
    const [_$listChanged, $listChanged] = M.createAdapter()

    const $item = M.map(
        () => (vnodeR.attrs.key && get(vnodeR.attrs.key)) || {},
        M.startWith({}, $listChanged)
    )
    list.map(_$listChanged)

    const $completeEffect = M.map(item => {
        const newItem = Object.assign({}, item, { completed: !item.completed })
        update(newItem)
        return newItem
    }, M.sample($item, $complete))

    const $editingText = M.mergeArray([
        M.map(e => e.target.value, $keyup),
        M.map(item => item.title, $item),
        M.map(
            item => item.title,
            M.sample($item, M.filter(e => e.keyCode === 27, $keyup))
        )
    ])

    const $confirmEditingItem = M.map(newItem => {
        update(newItem)
        return newItem
    }, M.sample(M.combine((text, item) => Object.assign({}, item, { title: text }), $editingText, $item), $confirmEditing))

    const $editingStatus = M.scan(
        v => !v,
        false,
        M.mergeArray([
            $editing,
            $confirmEditingItem,
            M.filter(e => e.keyCode === 27, $keyup)
        ])
    )

    const $itemRes = M.merge($item, $completeEffect, $confirmEditingItem)

    return [
        {
            _$keyup,
            _$complete,
            _$editing,
            _$delete,
            _$cancelEditing,
            _$confirmEditing
        },
        { $item: $itemRes, $editing: $editingStatus, $editingText }
    ]
}
