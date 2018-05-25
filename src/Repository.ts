export default interface Repository {
  get(key: string, defaultValue?: string): Promise<string | null>
  set(key: string, value: string, overwrite?: boolean): Promise<boolean>
  remove(key: string): Promise<boolean>
  size(): Promise<number>
}
