import { m, I, M } from './vendor.mjs'
export { mm, adapters, route }

function route(data) {
    if (data) {
        if (typeof route.stream === 'undefined') {
            const [_$route, $routechange] = M.createAdapter()
            route.trigger = _$route
            route.stream = M.startWith(data, $routechange)
        } else {
            route.trigger(data)
        }
    }
    return route.stream
}

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

    const [_$done, $done] = multicastAdapter()

    const [triggers, streams] = vm(VnodeRecord(vnode))

    const { _$oninit, _$oncreate, _$onupdate, _$onremove } = triggers

    const { $oninit, $oncreate, $onupdate, $onremove, ...effects } = streams

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

    return {
        oninit: vnode => {
            // console.log('run effect')
            //
            M.runEffects(
                M.until(
                    $done,
                    M.merge(
                        M.tap(
                            m.redraw,
                            M.merge(
                                M.tap(newState => {
                                    state = StateRecord(newState)
                                }, M.combineArray(stateObject(stateKeys), stateStreams(stateKeys, effects))),
                                M.mergeArray(effectStreams(stateKeys, effects))
                            )
                        ),
                        M.mergeArray(
                            [$oninit, $oncreate, $onupdate, $onremove].filter(
                                e => e
                            )
                        )
                    )
                ),
                M.scheduler()
            )
            _$oninit && _$oninit(vnode)
        },
        oncreate: vnode => _$oncreate && _$oncreate(VnodeRecord(vnode)),
        onupdate: vnode => _$onupdate && _$onupdate(VnodeRecord(vnode)),
        onremove: vnode => {
            _$onremove && _$onremove(VnodeRecord(vnode))
            _$done(true)
        },
        view: vnode => view(state, triggers, VnodeRecord(vnode))
    }
}

const adapters = nameList =>
    nameList.reduce(
        (out, name) => {
            ;[
                out.triggers['_$' + name],
                out.streams['$' + name]
            ] = M.createAdapter()
            return out
        },
        { streams: {}, triggers: {} }
    )
