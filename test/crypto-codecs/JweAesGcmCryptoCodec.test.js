import test from 'ava'
import JweAesGcmCryptoCodec from '../../dist/lib/crypto-codecs/JweAesGcmCryptoCodec'
// const jose = require('node-jose')

test.beforeEach(t => {
  t.context['crypto'] = new JweAesGcmCryptoCodec()
})

test(`decrypting encrypted value returns the original value`, async t => {
  const crypto = t.context['crypto']
  const expectedValue ='Hallo Welt!'
  const cipher = await crypto.encrypt(expectedValue)
  const decryptedValue = await crypto.decrypt(cipher)
  t.falsy(cipher === expectedValue)
  t.truthy(decryptedValue === expectedValue)
})
