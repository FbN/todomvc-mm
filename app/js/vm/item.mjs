import { m, M } from '../vendor.mjs'
import { list, get, del, update } from '../model/todo.mjs'

export default function itemVM (vnodeR) {
    const [_$oninit, $oninit] = M.createAdapter()
    const [_$keyup, $keyup] = M.createAdapter()
    const [_$input, $input] = M.createAdapter()
    const [_$complete, $complete] = M.createAdapter()
    const [_$editing, $editing] = M.createAdapter()
    const [_$delete, $delete] = M.createAdapter()
    const [_$confirmEditing, $confirmEditing] = M.createAdapter()
    const [_$listChanged, $listChanged] = M.createAdapter()

    const $enter = M.filter(e => e.keyCode === 13, $keyup)
    const $esc = M.filter(e => e.keyCode === 27, $keyup)

    const $confirmOnEnter = M.merge($confirmEditing, $enter)

    const $item = M.map(
        () => (vnodeR.attrs.key && get(vnodeR.attrs.key)) || {},
        M.startWith({}, $listChanged)
    )

    const $observeList = M.tap(() => list.map(_$listChanged), $oninit)

    const $completeEffect = M.tap(
        update,
        M.map(item => {
            return Object.assign({}, item, { completed: !item.completed })
        }, M.sample($item, $complete))
    )

    const $editingText = M.mergeArray([
        M.map(e => e.target.value, $input),
        M.map(item => item.title, $item),
        M.map(item => item.title, M.sample($item, $esc))
    ])

    const $confirmEditingItem = M.tap(
        update,
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
        M.mergeArray([$editing, $confirmEditingItem, $esc])
    )

    const $itemRes = M.merge($item, $completeEffect, $confirmEditingItem)

    const $deleteItem = M.tap(item => del(item.id), M.sample($item, $delete))

    // const $logUpdate = M.tap(e => console.log('update', e), $onupdate)

    return [
        {
            _$keyup,
            _$input,
            _$complete,
            _$editing,
            _$delete,
            _$confirmEditing,
            _$oninit
        },
        {
            $item: $itemRes,
            $editing: $editingStatus,
            $editingText,
            $observeList,
            $deleteItem,
            $oninit
        }
    ]
}
