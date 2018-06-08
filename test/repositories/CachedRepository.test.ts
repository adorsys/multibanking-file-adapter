const os = require('os')
const micro = require('micro')
const rimraf = require('rimraf')
const cuid = require('cuid')
import CachedRepository from '../../src/repositories/CachedRepository'
import WebRepository from '../../src/repositories/WebRepository'
import InMemoryRepository from '../../src/repositories/InMemoryRepository'
import EncryptedRepository from '../../src/repositories/EncryptedRepository'
import LocalStorageRepository from '../../src/repositories/LocalStorageRepository'
import JweAesGcmCryptoCodec from '../../src/crypto-codecs/JweAesGcmCryptoCodec'
import routeHandler from '../api/routeHandler'

import avaTest, { TestInterface } from 'ava'
import Repository from '../../src/Repository'

const test = avaTest as TestInterface<{
  service: any
  id: string
  store: Repository
}>

const listen = require('test-listen')
const path = '/store'

const key = 'testKey'
const unknownKey = 'unknownKey'
const value = 'testValue'
const fortytwo = '42'

const errorHandler = error => {
  if (error) {
    console.log(error)
  }
}

test.beforeEach(async t => {
  t.context.id = cuid()
  const repository = new InMemoryRepository()
  repository.set(key, fortytwo)
  t.context.service = micro(routeHandler(repository))
  const url = (await listen(t.context.service)) + path
  t.context.store = new CachedRepository(
    new WebRepository(url),
    new EncryptedRepository(
      new LocalStorageRepository(`${os.tmpdir()}/test-store-${t.context.id}`),
      new JweAesGcmCryptoCodec()
    )
  )
})

test.afterEach.always(t => {
  t.context.service.close()
  rimraf(`${os.tmpdir()}/test-store-${t.context.id}`, errorHandler)
})

test(`setting value returns true`, async t => {
  t.true(await t.context.store.set(unknownKey, value))
  t.is(await t.context.store.size(), 1)
})

test(`get returns 'null' for unknown key`, async t => {
  t.is(await t.context.store.get(unknownKey), null)
  t.is(await t.context.store.size(), 0)
})

test(`get returns default value for unknown key`, async t => {
  t.is(await t.context.store.get(unknownKey, value), value)
  t.is(await t.context.store.size(), 0)
})

test(`get returns the value previously set`, async t => {
  await t.context.store.set(unknownKey, value)
  t.is(await t.context.store.get(unknownKey), value)
  t.is(await t.context.store.size(), 1)
})

test(`get reads values from remote repository for cache misses`, async t => {
  t.is(await t.context.store.size(), 0)
  t.is(await t.context.store.get(key), fortytwo)
})

test(`set overwrites values`, async t => {
  t.is(await t.context.store.get(key), fortytwo)
  t.is(await t.context.store.size(), 1)
  t.is(await t.context.store.set(key, value), true)
  t.is(await t.context.store.get(key), value)
  t.is(await t.context.store.size(), 1)
})

test(`set does not overwrite`, async t => {
  t.is(await t.context.store.get(key), fortytwo)
  t.is(await t.context.store.size(), 1)
  t.is(await t.context.store.set(key, value, false), false)
  t.is(await t.context.store.get(key), fortytwo)
  t.is(await t.context.store.size(), 1)
})

test(`values can be removed`, async t => {
  t.is(await t.context.store.set(unknownKey, value), true)
  t.is(await t.context.store.size(), 1)
  t.is(await t.context.store.remove(unknownKey), true)
  t.is(await t.context.store.size(), 0)
  t.is(await t.context.store.remove(unknownKey), false)
  t.is(await t.context.store.size(), 0)
})
