import RuneId from './rune_id'

export default class Edict {
  id: RuneId
  amount: number
  output: number

  constructor(id: RuneId, amount: number, output: number) {
    this.id = id
    this.amount = amount
    this.output = output
  }
}
