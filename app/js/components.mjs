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

const mm = (initialState, vm, view) => vnode => {
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

    const [triggers, effects] = vm(
        {
            $oninit,
            $oncreate,
            $onupdate,
            $onremove
        },
        VnodeRecord(vnode)
    )

    // ritorna array con i soli stream inerenti gli stati in ingresso
    const stateStreams = (stateKeys, effects) =>
        stateKeys.reduce(
            (res, key) => res.push(effects['$' + key] || null) && res,
            []
        )

    // ritorna array con stream non inerenti stati in ingresso
    const effectStreams = (stateKeys, effects) =>
        Object.keys(effects)
            .filter(key => !stateKeys.includes(key.substring(1)))
            .reduce((res, key) => res.push(effects[key]) && res, [])

    // converte array di risultato stato in una mappa di stati
    const stateObject = stateKeys => (...arrStatus) =>
        stateKeys.map((key, index) => [key, index]).reduce((res, entry) => {
            res[entry[0]] = arrStatus[entry[1]]
            return res
        }, {})

    const stateKeys = Object.keys(initialState)

    // M.runEffects(M.until($done, $oninit))
    // M.runEffects(M.until($done, $oncreate))
    // M.runEffects(M.until($done, $onupdate))

    return {
        oninit: vnode => {
            // console.log('run effect')
            //
            M.runEffects(
                M.until(
                    $done,
                    M.tap(
                        m.redraw,
                        M.merge(
                            M.tap(newState => {
                                state = StateRecord(newState)
                            }, M.combineArray(stateObject(stateKeys), stateStreams(stateKeys, effects))),
                            M.mergeArray(effectStreams(stateKeys, effects))
                        )
                    )
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
