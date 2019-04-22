import { m } from './vendor.mjs'
import { mainComponent } from './components.mjs'
import { route } from './mm.mjs'

m.route(document.querySelector('.todoapp'), '/', {
    '/': {
        onmatch: function (args, path) {
            route({ args, path })
            return mainComponent
        }
    },
    '/:filter': {
        onmatch: function (args, path) {
            route({ args, path })
            return mainComponent
        }
    }
})
