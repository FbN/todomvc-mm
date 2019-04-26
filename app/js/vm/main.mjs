import { m, M } from '../vendor.mjs'
import { _$add, $list, filter, enter, esc } from '../model/todo.mjs'
import { adapters, route } from '../mm.mjs'
window.m = m
export default function itemVM (vnodeR) {
    const $route = route()

    const { streams: S, triggers: T } = adapters([
        'add',
        'completeAllEvent',
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
        _$add,
        M.sample(M.map(e => e.target.value, S.$input), $enter)
    )

    const $isAllCompleted = M.map(
        list => !list.filter(filter('active')).length,
        $list
    )

    const $cae = M.tap(
        () =>
            list(
                list().map(task =>
                    Object.assign({}, task, { completed: !isAllCompleted() })
                )
            ),
        S.$completeAllEvent
    )

    const $filteredTasks = M.snapshot(
        (list, { args: { filter: type } }) =>
            type ? list.filter(filter(type)) : list,
        $list,
        M.sample($route, M.merge($list, $route))
    )

    return [
        T,
        {
            $tasks: $filteredTasks,
            $isAllCompleted,
            $txt: M.startWith('', $editingText),
            $cae,
            $addEffect
        }
    ]
}
