import Repository from '../../src/Repository'
import InMemoryRepository from '../../src/repositories/InMemoryRepository'
import avaTest, { TestInterface } from 'ava'

const test = avaTest as TestInterface<{ store: Repository }>
const key: string = 'testkey'
const value: string = 'testValue'
const fortytwo: string = '42'

test.beforeEach(t => {
  t.context.store = new InMemoryRepository()
})

test(`setting value returns true`, async t => {
  t.true(await t.context.store.set(key, value))
  t.is(await t.context.store.size(), 1)
})

test(`get returns 'null' for unknown key`, async t => {
  t.is(await t.context.store.get(key), null)
  t.is(await t.context.store.size(), 0)
})

test(`get returns default value for unknown key`, async t => {
  t.is(await t.context.store.get(key, value), value)
  t.is(await t.context.store.size(), 0)
})

test(`get returns the value previously set`, async t => {
  await t.context.store.set(key, value)
  t.is(await t.context.store.get(key), value)
  t.is(await t.context.store.size(), 1)
})

test(`set overwrites values`, async t => {
  t.is(await t.context.store.set(key, value), true)
  t.is(await t.context.store.get(key), value)
  t.is(await t.context.store.size(), 1)
  t.is(await t.context.store.set(key, fortytwo), true)
  t.is(await t.context.store.get(key), fortytwo)
  t.is(await t.context.store.size(), 1)
})

test(`set does not overwrite`, async t => {
  t.is(await t.context.store.set(key, value), true)
  t.is(await t.context.store.get(key), value)
  t.is(await t.context.store.size(), 1)
  t.is(await t.context.store.set(key, fortytwo, false), false)
  t.is(await t.context.store.get(key), value)
  t.is(await t.context.store.size(), 1)
})

test(`values can be removed`, async t => {
  t.is(await t.context.store.set(key, value), true)
  t.is(await t.context.store.size(), 1)
  t.is(await t.context.store.remove(key), true)
  t.is(await t.context.store.size(), 0)
  t.is(await t.context.store.remove(key), false)
  t.is(await t.context.store.size(), 0)
})
