# MVVM FPR Mithril • [TodoMVC](http://todomvc.com)

> Official description of the framework (from its website)


## Resources

- [Website](https://mithril.js.org/)
- [Documentation](https://mithril.js.org/api.html)
- [Chat](https://gitter.im/mithriljs/mithril.js)

### Articles

- [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)
- [FRP](https://en.wikipedia.org/wiki/Functional_reactive_programming)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

### Support

- [Author](https://github.com/FbN)

*Let us [know](https://github.com/tastejs/todomvc/issues) if you discover anything worth sharing.*


## Implementation

The project is an experiment to structure a Mithril 2.x SPA following MVVM pattern and Fuctional reactive programming.

### Omissis
To keep it dry no transpiler, JSX or additional library was used. The project is ready to be bowsed with Chrome or another modern ES6 modules compatible browser.

### Architecture

#### Views (folder /js/view)
View files are [Mithril 2.x closure components](https://mithril.js.org/components.html). To comply with mvvc mithril component state is not used. Diffrently on standard mithril functional components, the view takes a second parameter: the view model object. The view model is responsable to store local component state and implement component logic (eventually working with models).
Views cannot directly interact with models.
A view can have one or zero view model object.
Views are stateless.
Views can import other components.

#### Views Models Functions (folder /js/vm)
Functions for VM objects generation. A vm function can be assigned to many views components. Every time a component is constructed a new VM Object is generated and passed as made available to view.
View Model Object are statefull.
View Model can works with assigned view and with imported models.
View Model is prototype scope: every component instance got a new VM Object.

#### Models (folder /js/model)
Model files are the right place for application business logic. They are ES6 singleton modules. Mithril Stream library is used for data storing and reactive programming.

## Credit

Created by [Fabiano Taioli](https://github.com/FbN)
