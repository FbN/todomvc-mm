import { m, M } from '../vendor.mjs'
import {
    T as TodoT,
    $list,
    allCompleted,
    enter,
    esc
} from '../model/todo.mjs'
import { adapters, route } from '../mm.mjs'

export default function itemVM(vnodeR) {
    const $route = route()

    const { streams: S, triggers: T } = adapters([
        'tasks',
        'keyup',
        'input'
    ])

    const $enter = enter(S.$keyup)

    const $editingText = M.merge(
        M.map(e => e.target.value, S.$input),
        M.map(() => '', $enter)
    )

    const $addEffect = M.tap(
        TodoT._$add,
        M.sample(M.map(e => e.target.value, S.$input), $enter)
    )

    const $filteredTasks = M.snapshot(
        (list, { args: { filter: type } }) =>
            type
                ? list.filter(task => task.completed == (type === 'completed'))
                : list,
        $list,
        M.sample($route, M.merge($list, $route))
    )

    return [
        { ...T, _$togleAll: TodoT._$togleAll },
        {
            $tasks: $filteredTasks,
            $isAllCompleted: M.map(allCompleted, $list),
            $txt: M.startWith('', $editingText),
            $addEffect
        }
    ]
}
