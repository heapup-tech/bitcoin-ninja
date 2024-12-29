export default class Rune {
  private _value: bigint
  constructor(value: bigint) {
    this._value = value
  }

  display() {
    let n = this._value

    n += 1n

    let symbol = ''
    while (n > 0n) {
      const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Number((n - 1n) % 26n))
      symbol += char
      n = (n - 1n) / 26n
    }

    return symbol.split('').reverse().join('')
  }
}
