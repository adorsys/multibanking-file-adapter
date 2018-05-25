import Repository from '../Repository'

const LocalStorage = require('node-localstorage').LocalStorage

export default class LocalStorageRepository implements Repository {
  private storage: any

  constructor(path: string) {
    this.storage =
      typeof localStorage === 'undefined' || localStorage === null
        ? new LocalStorage(path)
        : localStorage
  }

  async get(key: string, defaultValue?: string): Promise<string | null> {
    const value = this.storage.getItem(key)
    return value !== null ? value : defaultValue ? defaultValue : null
  }

  async set(
    key: string,
    value: string,
    overwrite: boolean = true
  ): Promise<boolean> {
    if (this.storage.getItem(key) !== null && !overwrite) {
      return false
    }
    this.storage.setItem(key, value)
    return true
  }

  async remove(key: string): Promise<boolean> {
    const keyExists = this.storage.getItem(key) !== null
    this.storage.removeItem(key)
    return keyExists
  }

  async size(): Promise<number> {
    return this.storage.length
  }

  clear(): void {
    this.storage.clear()
    return
  }
}
