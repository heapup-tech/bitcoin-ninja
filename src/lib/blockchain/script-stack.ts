export default class ScriptStack {
  private items: string[] = []
  push(element: string) {
    this.items.push(element)
  }

  pop() {
    return this.items.pop()
  }

  peek() {
    return this.items[this.items.length - 1]
  }

  isEmpty() {
    return this.items.length === 0
  }

  clear() {
    this.items = []
  }

  size() {
    return this.items.length
  }

  data() {
    return this.items
  }
}
