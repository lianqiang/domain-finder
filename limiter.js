module.exports = class Limiter {
  constructor (settings) {
    this.max_concurrent = settings.max_concurrent ? settings.max_concurrent : null
    this.interval_concurrent = settings.interval_concurrent ? settings.interval_concurrent : null
    this.count = 0
  }
  process (func, ...args) {
    if (!this.max_concurrent || !this.interval_concurrent) {
      func(...args)
      return
    }
    if (this.count === 0) {
      setTimeout(() => { this.count = 0 }, this.interval_concurrent)
    }
    if (this.count < this.max_concurrent) {
      this.count ++
      func(...args)
    } else {
      setTimeout(() => {
        this.process(func, ...args)
      }, this.interval_concurrent)
    }
  }
}
