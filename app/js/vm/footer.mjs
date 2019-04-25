import { m, M } from '../vendor.mjs'
import { _$del, $list, filter } from '../model/todo.mjs'
import { adapters } from '../mm.mjs'

export default function itemVM (vnodeR) {
    const { streams: S, triggers: T } = adapters(['tasks', 'clear'])

    const $itemLeft = M.map(list => list.filter(filter('active')).length, $list)

    // const $clear = M.tap(
    //     list => list.map(e => e.id).forEach(_$del),
    //     M.map(
    //         list => list.filter(filter('completed')),
    //         M.sample($list, S.$clear)
    //     )
    // )

    return [
        T,
        {
            $tasks: $list,
            $itemLeft //,
            // $clear
        }
    ]
}
