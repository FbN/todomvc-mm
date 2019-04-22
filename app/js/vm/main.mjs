import { m, M } from '../vendor.mjs'
import { list, add, filter } from '../model/todo.mjs'
import { adapters, route } from '../mm.mjs'

export default function itemVM (vnodeR) {
    const $route = route()

    const { streams: S, triggers: T } = adapters([
        'add',
        'completeAllEvent',
        'oninit',
        'tasks',
        'keyup',
        'input'
    ])

    const $enter = M.filter(e => e.keyCode === 13, S.$keyup)
    const $esc = M.filter(e => e.keyCode === 27, S.$keyup)

    const $editingText = M.merge(
        M.map(e => e.target.value, S.$input),
        M.map(() => '', $enter)
    )

    const $addEffect = M.tap(
        add,
        M.sample(M.map(e => e.target.value, S.$input), $enter)
    )

    const $observeList = M.tap(() => {
        list.map(T._$tasks)
    }, S.$oninit)

    const $isAllCompleted = M.map(
        list => !list.filter(filter('active')).length,
        S.$tasks
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
        (list, { args: { filter: type } }) => {
            console.log('-> route', type)
            return type ? list.filter(filter(type)) : list
        },
        S.$tasks,
        M.sample($route, M.merge(S.$tasks, $route))
    )

    return [
        T,
        {
            $tasks: $filteredTasks,
            $isAllCompleted,
            $txt: M.startWith('', $editingText),
            $cae,
            $oninit: $observeList,
            $addEffect
        }
    ]
}
