import { m } from '../vendor.mjs'

import { itemComponent } from '../components.mjs'
import { footerComponent } from '../components.mjs'

export default function itemView (
    { isAllCompleted, tasks, txt },
    { _$add, _$completeAllEvent, _$keyup, _$input },
    vnodeR
) {
    return [
        m('header.header', [
            m('h1', 'todos'),
            m('input.new-todo[placeholder="What needs to be done?"]', {
                autofocus: true,
                onkeyup: _$keyup,
                oninput: _$input,
                value: txt
            })
        ]),
        m(
            'section.main',
            {
                style: {
                    display: 'block'
                }
            },
            [
                tasks.length > 0
                    ? m('input#toggle-all.toggle-all[type=checkbox]', {
                        checked: isAllCompleted,
                        onclick: _$completeAllEvent
                    })
                    : '',
                m('label', {
                    for: 'toggle-all'
                }),
                m(
                    'ul.todo-list',
                    tasks.map(task =>
                        m(itemComponent, { key: task.id, item: task })
                    )
                )
            ]
        ),
        m(footerComponent)
    ]
}
