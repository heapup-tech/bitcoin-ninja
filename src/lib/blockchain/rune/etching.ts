import Rune from './rune'
import Terms from './terms'

export default class Etching {
  divisibility?: number
  premine?: bigint
  rune?: Rune
  spacers?: number
  symbol?: string
  terms?: Terms
  turbo: boolean = false
}
