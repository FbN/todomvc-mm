import { m } from '../vendor.mjs'

export default function itemView ({ tasks, itemLeft }, { _$clear }, vnodeR) {
    return tasks.length > 0
        ? m('footer.footer', [
            m('span.todo-count', [
                m('strong', itemLeft),
                ' item' + (itemLeft !== 1 ? 's' : '') + ' left'
            ]),
            m('ul.filters', [
                m('li', [
                    m(
                        'a[href=/]',
                        {
                            oncreate: m.route.link,
                            class: m.route.get() === '/' ? 'selected' : ''
                        },
                        'All'
                    )
                ]),
                m('li', [
                    m(
                        'a[href=/active]',
                        {
                            oncreate: m.route.link,
                            class:
                                  m.route.get() === '/active' ? 'selected' : ''
                        },
                        'Active'
                    )
                ]),
                m('li', [
                    m(
                        'a[href=/completed]',
                        {
                            oncreate: m.route.link,
                            class:
                                  m.route.get() === '/completed'
                                      ? 'selected'
                                      : ''
                        },
                        'Completed'
                    )
                ])
            ]),
            m(
                'button.clear-completed',
                { onclick: _$clear },
                'Clear completed'
            )
        ])
        : m('')
}
