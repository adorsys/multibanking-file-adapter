import axios, { AxiosInstance } from 'axios'
import Repository from '../Repository'

export default class WebRepository implements Repository {
  private api: AxiosInstance

  constructor(url: string) {
    this.api = axios.create({
      baseURL: url,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async get(
    key: string,
    defaultValue?: string | undefined
  ): Promise<string | null> {
    const response = await this.api.post('/read', { key })
    if (response.status === 204) {
      return defaultValue || null
    }
    return response.data
  }

  async set(
    key: string,
    value: string,
    overwrite: boolean = true
  ): Promise<boolean> {
    if (!overwrite && (await this.get(key))) {
      return false
    }
    await this.api.post('/write', { key, value })
    return true
  }

  async remove(key: string): Promise<boolean> {
    const response = await this.api.post('/remove', { key })
    return response.data
  }

  async size(): Promise<number> {
    return (await this.api.get('/size')).data
  }
}
