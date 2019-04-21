import { m, M } from '../vendor.mjs'
import { list, get, del, update } from '../model/todo.mjs'

const makeAdapters = nameList =>
    nameList.reduce(
        (streamsAndTriggers, name) => {
            ;[
                streamsAndTriggers.triggers['_$' + name],
                streamsAndTriggers.streams['$' + name]
            ] = M.createAdapter()
            return streamsAndTriggers
        },
        { streams: {}, triggers: {} }
    )

export default function itemVM (vnodeR) {
    const { streams: S, triggers: T } = makeAdapters([
        'oninit',
        'onupdate',
        'keyup',
        'input',
        'complete',
        'editing',
        'delete',
        'confirmEditing',
        'listChanged'
    ])

    const $enter = M.filter(e => e.keyCode === 13, S.$keyup)
    const $esc = M.filter(e => e.keyCode === 27, S.$keyup)

    const $confirmOnEnter = M.merge(S.$confirmEditing, $enter)

    const $item = M.map(
        () => (vnodeR.attrs.key && get(vnodeR.attrs.key)) || {},
        M.startWith({}, S.$listChanged)
    )

    const $observeList = M.tap(() => list.map(T._$listChanged), S.$oninit)

    const $completeEffect = M.tap(
        update,
        M.map(item => {
            return Object.assign({}, item, { completed: !item.completed })
        }, M.sample($item, S.$complete))
    )

    const $editingText = M.mergeArray([
        M.map(e => e.target.value, S.$input),
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
        M.mergeArray([S.$editing, $confirmEditingItem, $esc])
    )

    const $itemRes = M.merge($item, $completeEffect, $confirmEditingItem)

    const $deleteItem = M.tap(item => del(item.id), M.sample($item, S.$delete))

    const $logUpdate = M.tap(e => console.log('update', e), S.$onupdate)

    return [
        T,
        {
            $item: $itemRes,
            $editing: $editingStatus,
            $editingText,
            $observeList,
            $deleteItem,
            $oninit: $observeList,
            $onupdate: $logUpdate
        }
    ]
}
