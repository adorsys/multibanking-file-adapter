import Repository from '../Repository'

export default class CachedRepository implements Repository {
  private repository: Repository
  private cache: Repository

  constructor(repository: Repository, cache: Repository) {
    this.repository = repository
    this.cache = cache
  }

  async get(key: string, defaultValue?: string): Promise<string | null> {
    const cachedValue = await this.cache.get(key, defaultValue)
    if (cachedValue !== null) {
      return cachedValue
    }
    const value = await this.repository.get(key, defaultValue)
    if (value !== null) {
      await this.cache.set(key, value)
      return value
    }
    return defaultValue || null
  }

  async set(
    key: string,
    value: string,
    overwrite: boolean = true
  ): Promise<boolean> {
    await this.cache.set(key, value, overwrite)
    return this.repository.set(key, value, overwrite)
  }

  async remove(key: string): Promise<boolean> {
    await this.cache.remove(key)
    return this.repository.remove(key)
  }

  async size(): Promise<number> {
    return this.cache.size()
  }
}
