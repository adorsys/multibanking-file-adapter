import os from 'os'
import test from 'ava'
import micro from 'micro'
import rimraf from 'rimraf'
import cuid from 'cuid'
import CachedRepository from '../../dist/lib/repositories/CachedRepository'
import WebRepository from '../../dist/lib/repositories/WebRepository'
import InMemoryRepository from '../../dist/lib/repositories/InMemoryRepository'
import EncryptedRepository from '../../dist/lib/repositories/EncryptedRepository'
import LocalStorageRepository from '../../dist/lib/repositories/LocalStorageRepository'
import JweAesGcmCryptoCodec from '../../dist/lib/crypto-codecs/JweAesGcmCryptoCodec'

const routeHandler = require('../api/routeHandler')
const listen = require('test-listen')
const path = '/store'

const key = 'testKey'
const value = 'testValue'
const fortytwo = '42'

const errorHandler = error => {
  if (error) {
    console.log(error)
  }
}

test.beforeEach(async t => {
  t.context['service'] = micro(routeHandler(new InMemoryRepository()))
  const url = (await listen(t.context['service'])) + path
  t.context['id'] = cuid()
  t.context['store'] = new CachedRepository(
    new WebRepository(url),
    new EncryptedRepository(
      new LocalStorageRepository(`${os.tmpdir()}/test-store-${t.context['id']}`),
      new JweAesGcmCryptoCodec()
    )
  )
})

test.afterEach.always(t => {
  t.context['service'].close()
  rimraf(`${os.tmpdir()}/test-store-${t.context['id']}`, errorHandler)
})

test(`setting value returns true`, async t => {
  t.true(await t.context['store'].set(key, value))
  t.is(await t.context['store'].size(), 1)
})

test(`get returns 'null' for unknown key`, async t => {
  t.is(await t.context['store'].get(key), null)
  t.is(await t.context['store'].size(), 0)
})

test(`get returns default value for unknown key`, async t => {
  t.is(await t.context['store'].get(key, value), value)
  t.is(await t.context['store'].size(), 0)
})

test(`get returns the value previously set`, async t => {
  await t.context['store'].set(key, value)
  t.is(await t.context['store'].get(key), value)
  t.is(await t.context['store'].size(), 1)
})

test(`set overwrites values`, async t => {
  t.is(await t.context['store'].set(key, value), true)
  t.is(await t.context['store'].get(key), value)
  t.is(await t.context['store'].size(), 1)
  t.is(await t.context['store'].set(key, fortytwo), true)
  t.is(await t.context['store'].get(key), fortytwo)
  t.is(await t.context['store'].size(), 1)
})

test(`set does not overwrite`, async t => {
  t.is(await t.context['store'].set(key, value), true)
  t.is(await t.context['store'].get(key), value)
  t.is(await t.context['store'].size(), 1)
  t.is(await t.context['store'].set(key, fortytwo, false), false)
  t.is(await t.context['store'].get(key), value)
  t.is(await t.context['store'].size(), 1)
})

test(`values can be removed`, async t => {
  t.is(await t.context['store'].set(key, value), true)
  t.is(await t.context['store'].size(), 1)
  t.is(await t.context['store'].remove(key), true)
  t.is(await t.context['store'].size(), 0)
  t.is(await t.context['store'].remove(key), false)
  t.is(await t.context['store'].size(), 0)
})
