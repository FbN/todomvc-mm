import { m, I, M } from './vendor.mjs'

import mainView from './view/main.mjs'
import mainVM from './vm/main.mjs'

import itemView from './view/item.mjs'
import itemVM from './vm/item.mjs'

import footerView from './view/footer.mjs'
import footerVM from './vm/footer.mjs'

import { deepFreezeCopy } from './lib.mjs'

const multicastAdapter = () => {
    const [trigger, stream] = M.createAdapter()
    return [trigger, M.multicast(stream)]
}

const mm = (initialState, effectStreams, view) => vnode => {
    const VnodeRecord = new I.Record({
        tag: undefined,
        key: undefined,
        attrs: undefined,
        children: undefined,
        text: undefined,
        dom: undefined
    })
    const StateRecord = new I.Record(initialState || {})
    let state = StateRecord()
    const [_$oninit, $oninit] = multicastAdapter()
    const [_$oncreate, $oncreate] = multicastAdapter()
    const [_$onupdate, $onupdate] = multicastAdapter()
    const [_$onremove, $onremove] = multicastAdapter()
    const [_$done, $done] = multicastAdapter()

    const [triggers, effects] = effectStreams(
        {
            $oninit,
            $oncreate,
            $onupdate,
            $onremove
        },
        VnodeRecord(vnode)
    )

    const keys = Object.keys(effects)

    const objState = (...arrStatus) =>
        Object.fromEntries(arrStatus.map((v, i) => [keys[i].substring(1), v]))

    return {
        oninit: vnode => {
            M.runEffects(
                M.until(
                    $done,
                    M.tap(newState => {
                        state = StateRecord(newState)
                        m.redraw()
                    }, M.combineArray(objState, Object.values(effects)))
                ),
                M.scheduler()
            )
            _$oninit(vnode)
        },
        oncreate: vnode => _$oncreate(VnodeRecord(vnode)),
        onupdate: vnode => _$onupdate(VnodeRecord(vnode)),
        onremove: vnode => {
            _$onremove(VnodeRecord(vnode))
            _$done(true)
        },
        view: vnode => view(state, triggers, VnodeRecord(vnode))
    }
}

const vmComponent = (view, vmFactory) => vnode =>
    view(vnode, deepFreezeCopy(vmFactory(vnode)))

export const mainComponent = vmComponent(mainView, mainVM)
export const itemComponent = mm(
    {
        item: {},
        editing: false,
        editingText: ''
    },
    itemVM,
    itemView
)
export const footerComponent = vmComponent(footerView, footerVM)
