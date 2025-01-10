export default class Rune {
  private _value: bigint
  private _spacer: bigint
  constructor(value: bigint, spacer = 0n) {
    this._value = value
    this._spacer = spacer
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

  displayWithSpacers(spacers: number) {
    let str = this.display()

    let res = ''
    for (let i = 0; i < str.length; i++) {
      res += str.charAt(i)
      if (spacers > 0) {
        // Get the least significant bit
        let bit = spacers & 1

        if (bit === 1) {
          res += '•'
        }

        // Right shift the number to process the next bit
        spacers >>= 1
      }
    }

    return res
  }

  // Base26 encoding
  static fromSymbol(symbol: string) {
    let str = symbol.toUpperCase()
    str = str.replace(/[.•]+/g, '')

    let n = 0n
    for (let i = 0; i < str.length; i++) {
      n =
        n * 26n +
        BigInt('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(str.charAt(i)) + 1)
    }

    let spacer = Rune.getSpacerFromFullSymbol(symbol)

    return new Rune(n - 1n, BigInt(spacer))
  }

  static getSpacerFromFullSymbol(str: string) {
    let res = 0
    let spacersCnt = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i)
      if (char === '•' || char == '.') {
        res += 1 << (i - 1 - spacersCnt)
        spacersCnt++
      }
    }
    return res
  }

  get spacer() {
    return this._spacer
  }

  get value() {
    return this._value
  }
}
