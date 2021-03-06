import { m, M } from '../vendor.mjs'
import { T as TodoT, $list, enter, esc } from '../model/todo.mjs'
import { adapters } from '../mm.mjs'

export default function itemVM (vnodeR) {
    const { streams: S, triggers: T } = adapters([
        'keyup',
        'input',
        'complete',
        'editing',
        'delete',
        'confirmEditing'
    ])

    const $esc = esc(S.$keyup)

    const $confirmOnEnter = M.merge(S.$confirmEditing, enter(S.$keyup))

    const $item = M.startWith(
        vnodeR.attrs.item,
        M.map(
            list => list.find(item => item.id === vnodeR.attrs.key) || {},
            $list
        )
    )

    const $completeEffect = M.tap(
        TodoT._$update,
        M.map(
            item => Object.assign({}, item, { completed: !item.completed }),
            M.sample($item, S.$complete)
        )
    )

    const $editingText = M.mergeArray([
        M.map(e => e.target.value, S.$input),
        M.map(item => item.title, $item),
        M.map(item => item.title, M.sample($item, $esc))
    ])

    const $confirmEditingItem = M.tap(
        TodoT._$update,
        M.sample(
            M.combine(
                (text, item) => Object.assign({}, item, { title: text }),
                $editingText,
                $item
            ),
            $confirmOnEnter
        )
    )

    const $editingStatus = M.scan(
        v => !v,
        false,
        M.mergeArray([S.$editing, $confirmEditingItem, $esc])
    )

    const $itemRes = M.merge($item, $completeEffect, $confirmEditingItem)

    const $deleteItem = M.tap(
        item => TodoT._$del(item.id),
        M.sample($item, S.$delete)
    )

    return [
        T,
        {
            $item: $itemRes,
            $editing: $editingStatus,
            $editingText,
            $deleteItem
        }
    ]
}
