import test from 'ava'
import InMemoryRepository from '../../dist/lib/repositories/InMemoryRepository'
import EncryptedRepository from '../../dist/lib/repositories/EncryptedRepository'
import JweAesGcmCryptoCodec from '../../dist/lib/crypto-codecs/JweAesGcmCryptoCodec'

const key = 'key'
const value = 'value'

test.beforeEach(t => {
  t.context['inMemoryRepository'] = new InMemoryRepository()
  t.context['encryptedRepository'] = new EncryptedRepository(t.context['inMemoryRepository'], new JweAesGcmCryptoCodec())
})

test(`constructor is expecting 2 vlaues`, t => {
  t.is(EncryptedRepository.length, 2)
})

test(`values are stored encrypted`, async t => {
  await t.context['encryptedRepository'].set(key, value)
  let expected = await t.context['inMemoryRepository'].get(key)
  t.falsy(expected === value)
  t.is(await t.context['encryptedRepository'].size(), 1)
})

test(`reading non existing keys returns null`, async t => {
  t.is(await t.context['encryptedRepository'].get(key), null)
  t.is(await t.context['encryptedRepository'].size(), 0)
})

test(`reading non existing keys returns defaultValue`, async t => {
  t.is(await t.context['encryptedRepository'].get(key, value), value)
  t.is(await t.context['encryptedRepository'].size(), 0)
})

test(`decrypt works on encrypted value`, async t => {
  await t.context['encryptedRepository'].set(key, value)
  const decryptedValue = await t.context['encryptedRepository'].get(key)
  t.truthy(decryptedValue === value)
  t.is(await t.context['encryptedRepository'].size(), 1)
})

test(`values can be removed`, async t => {
  t.is(await t.context['encryptedRepository'].set(key, value), true)
  t.is(await t.context['encryptedRepository'].size(), 1)
  t.is(await t.context['encryptedRepository'].remove(key), true)
  t.is(await t.context['encryptedRepository'].size(), 0)
  t.is(await t.context['encryptedRepository'].remove(key), false)
  t.is(await t.context['encryptedRepository'].size(), 0)
})
