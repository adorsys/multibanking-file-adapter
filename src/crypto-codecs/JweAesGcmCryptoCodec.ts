import CryptoCodec from '../CryptoCodec'

const jose = require('node-jose')

export default class JweAesGcmCryptoCodec implements CryptoCodec {
  private _keystore: Promise<any>

  constructor() {
    this._keystore = new Promise(async (resolve, reject) => {
      const store = jose.JWK.createKeyStore()
      try {
        await store.generate('oct', 256, { alg: 'A256GCM', use: 'enc' })
        resolve(store)
      } catch (err) {
        reject(err)
      }
    })
  }

  async encrypt(data: string): Promise<string> {
    const keystore = await this._keystore
    const key = keystore.get({ use: 'enc' })
    const result = await jose.JWE
      .createEncrypt({ format: 'compact' }, key)
      .update(data)
      .final()
    return result
  }

  async decrypt(cipher: string): Promise<string> {
    const keystore = await this._keystore
    const result = await jose.JWE.createDecrypt(keystore).decrypt(cipher)
    return result.payload.toString()
  }
}
