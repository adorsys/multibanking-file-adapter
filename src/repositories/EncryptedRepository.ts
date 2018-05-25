import Repository from '../Repository'
import CryptoCodec from '../CryptoCodec'

export default class EncryptedRepository implements Repository {
  private repository: Repository
  private crypto: CryptoCodec

  constructor(repository: Repository, crypto: CryptoCodec) {
    this.repository = repository
    this.crypto = crypto
  }

  async get(key: string, defaultValue?: string): Promise<string | null> {
    const cipher = await this.repository.get(key)
    if (cipher === null) {
      return Promise.resolve(defaultValue ? defaultValue : null)
    }
    return this.crypto.decrypt(cipher)
  }

  async set(
    key: string,
    value: string,
    overwrite: boolean = true
  ): Promise<boolean> {
    const cipher = await this.crypto.encrypt(value)
    return this.repository.set(key, cipher, overwrite)
  }

  async remove(key: string): Promise<boolean> {
    return this.repository.remove(key)
  }

  async size(): Promise<number> {
    return this.repository.size()
  }
}
