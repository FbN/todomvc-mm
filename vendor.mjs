import * as mm from 'mithril'
import * as ms from 'mithril/stream'
import * as MostCore from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { createAdapter } from '@most/adapter'
import * as I from 'immutable'

const M = Object.assign({}, MostCore, {
    scheduler: newDefaultScheduler,
    createAdapter: createAdapter
})

const m = Object.assign(mm.m, mm, {
    stream: ms.default
})

export { m, M, I }
