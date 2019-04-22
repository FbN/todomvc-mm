import { m, I, M } from './vendor.mjs'

import mainView from './view/main.mjs'
import mainVM from './vm/main.mjs'

import itemView from './view/item.mjs'
import itemVM from './vm/item.mjs'

import footerView from './view/footer.mjs'
import footerVM from './vm/footer.mjs'

import { deepFreezeCopy } from './lib.mjs'

import { mm } from './mm.mjs'

const vmComponent = (view, vmFactory) => vnode =>
    view(vnode, deepFreezeCopy(vmFactory(vnode)))

export const mainComponent = mm(
    {
        isAllCompleted: false,
        tasks: [],
        txt: ''
    },
    mainVM,
    mainView
)
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
