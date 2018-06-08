const rimraf = require('rimraf')
const cuid = require('cuid')
const os = require('os')
import LocalStorageRepository from '../../src/repositories/LocalStorageRepository'
import Repository from '../../src/Repository'
import avaTest, { TestInterface } from 'ava'

const test = avaTest as TestInterface<{
  id: string
  cache: LocalStorageRepository
}>

const key = 'key'
const value = 'value'
const fortytwo = '42'

const errorHandler = error => {
  if (error) {
    console.log(error)
  }
}

test.beforeEach(t => {
  t.context.id = cuid()
  t.context.cache = new LocalStorageRepository(
    `${os.tmpdir()}/test-store-${t.context.id}`
  )
})

test.afterEach.always(t => {
  t.context.cache.clear()
  rimraf(`${os.tmpdir()}/test-store-${t.context.id}`, errorHandler)
})

test(`setting value returns true`, async t => {
  t.true(await t.context.cache.set(key, value))
  t.is(await t.context.cache.size(), 1)
})

test(`get returns 'null' for unknown key`, async t => {
  t.is(await t.context.cache.get(key), null)
  t.is(await t.context.cache.size(), 0)
})

test(`get returns default value for unknown key`, async t => {
  t.is(await t.context.cache.get(key, value), value)
  t.is(await t.context.cache.size(), 0)
})

test(`get returns the value previously set`, async t => {
  await t.context.cache.set(key, value)
  t.is(await t.context.cache.get(key), value)
  t.is(await t.context.cache.size(), 1)
})

test(`set overwrites values`, async t => {
  t.is(await t.context.cache.set(key, value), true)
  t.is(await t.context.cache.get(key), value)
  t.is(await t.context.cache.size(), 1)
  t.is(await t.context.cache.set(key, fortytwo), true)
  t.is(await t.context.cache.get(key), fortytwo)
  t.is(await t.context.cache.size(), 1)
})

test(`set does not overwrite`, async t => {
  t.is(await t.context.cache.set(key, value), true)
  t.is(await t.context.cache.get(key), value)
  t.is(await t.context.cache.size(), 1)
  t.is(await t.context.cache.set(key, fortytwo, false), false)
  t.is(await t.context.cache.get(key), value)
  t.is(await t.context.cache.size(), 1)
})

test(`values can be removed`, async t => {
  t.is(await t.context.cache.set(key, value), true)
  t.is(await t.context.cache.size(), 1)
  t.is(await t.context.cache.remove(key), true)
  t.is(await t.context.cache.size(), 0)
  t.is(await t.context.cache.remove(key), false)
  t.is(await t.context.cache.size(), 0)
})
