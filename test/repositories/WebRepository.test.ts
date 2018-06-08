const listen = require('test-listen')
import WebRepository from '../../src/repositories/WebRepository'
import micro from 'micro'
import InMemoryRepository from '../../src/repositories/InMemoryRepository'
import routeHandler from '../api/routeHandler'
import avaTest, { TestInterface } from 'ava'
import Repository from '../../src/Repository'

const test = avaTest as TestInterface<{
  service: any
  repository: Repository
}>

const path = '/store'

const key = 'testKey'
const value = 'testValue'
const fortytwo = '42'

test.beforeEach(async t => {
  t.context.service = micro(routeHandler(new InMemoryRepository()))
  const url = (await listen(t.context.service)) + path
  t.context.repository = new WebRepository(url)
})

test.afterEach.always(t => {
  t.context.service.close()
})

test(`read key from empty store returns null`, async t => {
  t.is(await t.context.repository.get(key), null)
})

test(`read key returns value for specified key`, async t => {
  t.is(await t.context.repository.set(key, value), true)
  t.is(await t.context.repository.get(key), value)
})

test(`write returns true`, async t => {
  t.is(await t.context.repository.set(key, value), true)
})

test(`remove key from empty store returns false`, async t => {
  t.is(await t.context.repository.remove(key), false)
})

test(`remove key removes value from store`, async t => {
  t.is(await t.context.repository.set(key, value), true)
  t.is(await t.context.repository.get(key), value)
  t.is(await t.context.repository.remove(key), true)
  t.is(await t.context.repository.get(key), null)
})

test(`setting value returns true`, async t => {
  t.true(await t.context.repository.set(key, value))
  t.is(await t.context.repository.size(), 1)
})

test(`get returns 'null' for unknown key`, async t => {
  t.is(await t.context.repository.get(key), null)
  t.is(await t.context.repository.size(), 0)
})

test(`get returns default value for unknown key`, async t => {
  t.is(await t.context.repository.get(key, value), value)
  t.is(await t.context.repository.size(), 0)
})

test(`get returns the value previously set`, async t => {
  await t.context.repository.set(key, value)
  t.is(await t.context.repository.get(key), value)
  t.is(await t.context.repository.size(), 1)
})

test(`set overwrites values`, async t => {
  t.is(await t.context.repository.set(key, value), true)
  t.is(await t.context.repository.get(key), value)
  t.is(await t.context.repository.size(), 1)
  t.is(await t.context.repository.set(key, fortytwo), true)
  t.is(await t.context.repository.get(key), fortytwo)
  t.is(await t.context.repository.size(), 1)
})

test(`set does not overwrite`, async t => {
  t.is(await t.context.repository.set(key, value), true)
  t.is(await t.context.repository.get(key), value)
  t.is(await t.context.repository.size(), 1)
  t.is(await t.context.repository.set(key, fortytwo, false), false)
  t.is(await t.context.repository.get(key), value)
  t.is(await t.context.repository.size(), 1)
})

test(`values can be removed`, async t => {
  t.is(await t.context.repository.set(key, value), true)
  t.is(await t.context.repository.size(), 1)
  t.is(await t.context.repository.remove(key), true)
  t.is(await t.context.repository.size(), 0)
  t.is(await t.context.repository.remove(key), false)
  t.is(await t.context.repository.size(), 0)
})
