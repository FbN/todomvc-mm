import { m, M } from '../vendor.mjs'
import { T as TodoT, $list } from '../model/todo.mjs'
import { adapters } from '../mm.mjs'

export default function itemVM(vnodeR) {
    const { streams: S, triggers: T } = adapters(['tasks'])

    const $itemLeft = M.map(
        list => list.filter(task => !task.completed).length,
        $list
    )

    return [
        { ...T, _$clear: TodoT._$clear },
        {
            $tasks: $list,
            $itemLeft
        }
    ]
}
