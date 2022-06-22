/**
 * Least recently used (LRU) cache
 */
export class LRU<E> {
  max: number
  cache: Map<string, E>
  missCallback: (key: string) => Promise<E>
  constructor(missCallback, max = 50) {
    this.missCallback = missCallback
    this.max = max
    this.cache = new Map()
  }
  has(key: string) {
    return this.cache.has(key)
  }
  async get(key: string) {
    let item = this.cache.get(key)
    if (item) {
      // move to top of cache
      this.cache.delete(key)
      this.cache.set(key, item)
    } else {
      item = await this.missCallback(key)
      this.put(key, item)
    }
    return item
  }
  put(key: string, item: E) {
    this.cache.set(key, item)
    if (this.cache.size === this.max) {
      this.cache.delete(this.first())
    }
  }
  first() {
    return this.cache.keys().next().value
  }
}
