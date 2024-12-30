import { script, Transaction } from 'bitcoinjs-lib'
import Edict from './edict'
import Etching from './etching'
import { Flag, FlagUtil } from './flag'
import Message from './message'
import Rune from './rune'
import RuneId from './rune_id'
import Tag from './tag'
import Terms from './terms'
import varint from './varint'

export default class RuneStone {
  readonly MAGIC_NUMBER = 0x5d // OP_13
  readonly COMMIT_CONFIRMATIONS = 6

  edicts: Edict[] = []
  etching?: Etching
  mint?: RuneId
  pointer?: number

  decipher(transaction: Transaction) {
    // decipher the transaction
    const payload = this.payload(transaction)
    if (!payload) return

    const integers = this.integers(payload)

    const { flaw, edicts, fields } = Message.from_integers(
      transaction,
      integers
    )

    console.log(fields)

    const flags = fields.get(BigInt(Tag.Flags))

    if (FlagUtil.take(Flag.Etching, flags?.[0] || 0n)) {
      const etching = new Etching()
      etching.divisibility =
        Number(fields.get(BigInt(Tag.Divisibility))) || undefined

      etching.premine = fields.get(BigInt(Tag.Premine))?.[0] || 0n

      const rune = new Rune(fields.get(BigInt(Tag.Rune))?.[0] || 0n)
      etching.rune = rune

      etching.spacers = Number(fields.get(BigInt(Tag.Spacers)))
      etching.symbol = String.fromCharCode(
        Number(fields.get(BigInt(Tag.Symbol)))
      )

      const terms: Terms = {
        cap: fields.get(BigInt(Tag.Cap))?.[0],
        amount: fields.get(BigInt(Tag.Amount))?.[0],
        height: [undefined, undefined],
        offset: [undefined, undefined]
      }
      etching.terms = terms
      etching.turbo = false
      this.etching = etching
    }

    const [block, tx] = fields.get(BigInt(Tag.Mint)) ?? []

    if (block && tx) {
      this.mint = new RuneId(Number(block), Number(tx))
    }

    const pointer = fields.get(BigInt(Tag.Pointer))?.[0]
    if (pointer) {
      this.pointer = Number(pointer)
    }
  }

  encipher() {
    // encipher the runestone
    if (this.etching) {
      let flags = 0

      if (this.etching.terms) {
      }
      if (this.etching.turbo) {
      }

      Tag.Flags
    }
  }

  payload(transaction: Transaction) {
    for (let i = 0; i < transaction.outs.length; i++) {
      const instructions = script.decompile(transaction.outs[i].script)

      if (!instructions) continue

      // 忽略不是以 OP_RETURN + OP_13 开头的输出
      if (instructions[0] !== 0x6a) continue
      if (instructions[1] !== this.MAGIC_NUMBER) continue

      return instructions[2] as Buffer
    }
  }

  integers(payload: Buffer) {
    const integers = []

    let i = 0
    while (i < payload.length) {
      const { n: integer, i: length } = varint.decode(payload.subarray(i))

      integers.push(integer)
      i += length
    }

    return integers
  }
}
