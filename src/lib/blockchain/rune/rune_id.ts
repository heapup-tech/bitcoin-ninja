export default class RuneId {
  block: number
  tx: number

  constructor(block: number, tx: number) {
    this.block = block
    this.tx = tx
  }
}
