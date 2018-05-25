import Repository from '../Repository'

export default class InMemoryRepository implements Repository {
  private values: any

  constructor() {
    this.values = {}
  }

  async get(key: string, defaultValue?: string): Promise<string | null> {
    const value = this.values[key]
    return value !== undefined ? value : defaultValue ? defaultValue : null
  }

  async set(
    key: string,
    value: string,
    overwrite: boolean = true
  ): Promise<boolean> {
    if (this.values[key] && !overwrite) {
      return false
    }
    this.values[key] = value
    return true
  }

  async remove(key: string): Promise<boolean> {
    const keyExists = Object.keys(this.values).some(k => k === key)
    delete this.values[key]
    return keyExists
  }

  async size(): Promise<number> {
    return Object.keys(this.values).length
  }
}
