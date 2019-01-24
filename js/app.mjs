/* global m */

import { mainComponent } from './components.mjs'

m.route(document.querySelector('.todoapp'), '/', {
    '/': mainComponent,
    '/:filter': mainComponent
})
