import Rune from './rune'

export default class Etching {
  divisibility?: number
  premine?: number
  rune?: Rune

  spacers?: number

  symbol?: string

  terms?: string
  turbo: boolean

  constructor(
    divisibility: number,
    premine: number,
    rune: Rune,
    spacers: number,
    symbol: string,
    terms: string,
    turbo: boolean
  ) {
    this.divisibility = divisibility
    this.premine = premine
    this.rune = rune
    this.spacers = spacers
    this.symbol = symbol
    this.terms = terms
    this.turbo = turbo
  }
}
