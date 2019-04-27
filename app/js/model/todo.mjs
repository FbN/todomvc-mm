/* localstorage */
import { m, M } from '../vendor.mjs'
import { adapters } from '../mm.mjs'
export { T, $list, allCompleted, enter, esc }
const STORAGE_ID = 'mm'

const generateUniqueID = () => new Date().getTime()

const { streams: S, triggers: T } = adapters([
    'add',
    'del',
    'update',
    'clear',
    'togleAll'
])

const $listAdd = M.map(
    title => list =>
        list.concat({
            id: generateUniqueID(),
            title: title.trim(),
            completed: false
        }),
    S.$add
)

const $listDel = M.map(
    id => list => list.filter(item => item.id !== id),
    S.$del
)

const $listClear = M.map(
    () => list => list.filter(item => !item.completed),
    S.$clear
)

const $listToggle = M.map(
    () => list => {
        const completed = allCompleted(list)
        return list.map(task =>
            Object.assign({}, task, { completed: !completed })
        )
    },
    S.$togleAll
)

const $listUpdate = M.map(
    item => list => list.map(i => (i.id === item.id ? item : i)),
    S.$update
)

const $list = M.multicast(
    M.tap(
        list => localStorage.setItem(STORAGE_ID, JSON.stringify(list)),
        M.scan(
            (list, f) => f(list),
            JSON.parse(localStorage.getItem(STORAGE_ID)) || [],
            M.mergeArray([
                $listToggle,
                $listAdd,
                $listDel,
                $listUpdate,
                $listClear
            ])
        )
    )
)

const allCompleted = list => !!list.filter(task => task.completed).length

const enter = stream => M.filter(e => e.keyCode === 13, stream)
const esc = stream => M.filter(e => e.keyCode === 27, stream)
