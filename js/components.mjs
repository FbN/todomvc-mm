/* global m */

import mainView from './view/main.mjs'
import mainVM from './vm/main.mjs'

import itemView from './view/item.mjs'
import itemVM from './vm/item.mjs'

import footerView from './view/footer.mjs'
import footerVM from './vm/footer.mjs'

const vmComponent = (view, vmFactory) => vnode =>
    view(vnode, vmFactory(vnode))

export const mainComponent = vmComponent(mainView, mainVM)
export const itemComponent = vmComponent(itemView, itemVM)
export const footerComponent = vmComponent(footerView, footerVM)