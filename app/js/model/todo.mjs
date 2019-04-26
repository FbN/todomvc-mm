/* localstorage */
import { m, M } from '../vendor.mjs'
export { _$add, _$del, _$update, $list, filter, enter, esc }
const STORAGE_ID = 'mm'

const generateUniqueID = () => new Date().getTime()

const [_$set, $set] = M.createAdapter()
const [_$add, $add] = M.createAdapter()
const [_$del, $del] = M.createAdapter()
const [_$update, $update] = M.createAdapter()
const [_$last, $last] = M.createAdapter()

const $listAdd = M.map(
    title => list =>
        list.concat({
            id: generateUniqueID(),
            title: title.trim(),
            completed: false
        }),
    $add
)

const $listDel = M.map(id => list => list.filter(item => item.id !== id), $del)

const $listSet = M.map(
    newList => list => newList,
    M.startWith(JSON.parse(localStorage.getItem(STORAGE_ID)) || [], $set)
)

const $listUpdate = M.map(
    item => list => list.map(i => (i.id === item.id ? item : i)),
    $update
)

const $list = M.multicast(
    M.tap(list => {
        localStorage.setItem(STORAGE_ID, JSON.stringify(list))
        return list
    }, M.scan((list, f) => f(list), [], M.mergeArray([$listSet, $listAdd, $listDel, $listUpdate])))
)

const filter = filter => item =>
    filter
        ? (filter === 'active' && item.completed === false) ||
          (filter === 'completed' && item.completed)
        : true

const enter = stream => M.filter(e => e.keyCode === 13, stream)
const esc = stream => M.filter(e => e.keyCode === 27, stream)
