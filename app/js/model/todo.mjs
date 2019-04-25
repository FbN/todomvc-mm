/* localstorage */
import { m, M } from '../vendor.mjs'
export { _$add, _$del, _$update, _$get, $list, filter }
const STORAGE_ID = 'mm'

const generateUniqueID = () => new Date().getTime()

const [_$set, $set] = M.createAdapter()
const [_$get, $get] = M.createAdapter()
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

const $listGet = M.map(() => list => list, $get)

const $listUpdate = M.map(
    item => list => list.map(i => (i.id === item.id ? item : i)),
    $update
)

const $list = M.multicast(
    M.tap(
        list => {
            console.log('map xsave', list)
            localStorage.setItem(STORAGE_ID, JSON.stringify(list))
            return list
        },
        M.scan(
            (list, f) => {
                const res = f(list)
                console.log('applico', f, res)
                return res
            },
            [],
            M.mergeArray([
                M.tap(v => console.log('$listGet', v), $listGet),
                M.tap(v => console.log('$listSet', v), $listSet),
                M.tap(v => console.log('$listAdd', v), $listAdd),
                M.tap(v => console.log('$listDel', v), $listDel),
                M.tap(v => console.log('$listUpdate', v), $listUpdate)
            ])
        )
    )
)

const filter = filter => item =>
    filter
        ? (filter === 'active' && item.completed === false) ||
          (filter === 'completed' && item.completed)
        : true
