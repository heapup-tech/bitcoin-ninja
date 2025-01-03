import { script, Transaction } from 'bitcoinjs-lib'
import { OPS } from 'bitcoinjs-lib/src/ops'
import Edict from './edict'
import Etching from './etching'
import { Flag, FlagManger } from './flag'
import Message from './message'
import Rune from './rune'
import RuneId from './rune_id'
import Tag, { tagEncode, tagEncodeOption } from './tag'
import Terms from './terms'
import varint from './varint'

export default class RuneStone {
  static readonly MAGIC_NUMBER = 0x5d // OP_13
  static readonly COMMIT_CONFIRMATIONS = 6

  edicts: Edict[] = []
  etching?: Etching
  mint?: RuneId
  pointer?: number

  decipher(transaction: Transaction) {
    // decipher the transaction
    const payload = this.payload(transaction)

    if (!payload) return

    // varint 解码
    const integers = this.integers(payload)
    const { flaw, edicts, fields } = Message.from_integers(
      transaction,
      integers
    )

    // console.log(fields)

    const flags = fields.get(BigInt(Tag.Flags))

    const flagManger = new FlagManger(flags?.[0] || 0n)
    if (flagManger.take(Flag.Etching)) {
      const etching = new Etching()
      etching.divisibility =
        Number(fields.get(BigInt(Tag.Divisibility))) || undefined

      etching.premine = fields.get(BigInt(Tag.Premine))?.[0] || 0n

      const rune = new Rune(fields.get(BigInt(Tag.Rune))?.[0] || 0n)
      etching.rune = rune

      etching.spacers = Number(fields.get(BigInt(Tag.Spacers)))

      // Unicode 解码
      let symbol = Number(fields.get(BigInt(Tag.Symbol)))
      etching.symbol = String.fromCodePoint(symbol)

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
    } else {
      this.mint = undefined
    }

    const pointer = fields.get(BigInt(Tag.Pointer))?.[0]
    if (pointer) {
      this.pointer = Number(pointer)
    }
  }

  encipher() {
    // encipher the runestone
    let payload: number[] = []

    const flagManger = new FlagManger(0n)
    if (this.etching) {
      flagManger.set(Flag.Etching)

      if (this.etching.terms) {
        flagManger.set(Flag.Terms)
      }
      if (this.etching.turbo) {
        flagManger.set(Flag.Turbo)
      }
      console.log(`flagManger.flags: ${flagManger.flags}`)

      tagEncode(Tag.Flags, [flagManger.flags], payload)

      if (this.etching?.rune) {
        tagEncodeOption(Tag.Rune, payload, this.etching.rune.value)
      }
      tagEncodeOption(Tag.Divisibility, payload, this.etching.divisibility)
      tagEncodeOption(Tag.Spacers, payload, this.etching.spacers)

      if (this.etching.symbol) {
        tagEncodeOption(
          Tag.Symbol,
          payload,
          BigInt(this.etching.symbol.charCodeAt(0))
        )
      }

      tagEncodeOption(Tag.Premine, payload, this.etching.premine)

      if (this.etching.terms) {
        tagEncodeOption(Tag.Amount, payload, this.etching.terms.amount)
        tagEncodeOption(Tag.Cap, payload, this.etching.terms.cap)
        tagEncodeOption(Tag.HeightStart, payload, this.etching.terms.height[0])
        tagEncodeOption(Tag.HeightEnd, payload, this.etching.terms.height[1])
        tagEncodeOption(Tag.OffsetStart, payload, this.etching.terms.offset[0])
        tagEncodeOption(Tag.OffsetEnd, payload, this.etching.terms.offset[1])
      }

      if (this.mint) {
        tagEncode(
          Tag.Mint,
          [BigInt(this.mint.block), BigInt(this.mint.tx)],
          payload
        )
      }
      const builder = [OPS.OP_RETURN, RuneStone.MAGIC_NUMBER]

      for (let i = 0; i < payload.length; i++) {
        builder.push(payload[i])
      }
      const res = script.compile(builder)

      console.log(res.toString('hex'))
    }
  }

  payload(transaction: Transaction) {
    for (let i = 0; i < transaction.outs.length; i++) {
      const instructions = script.decompile(transaction.outs[i].script)

      if (!instructions) continue

      // 忽略不是以 OP_RETURN + OP_13 开头的输出
      if (instructions[0] !== 0x6a) continue
      if (instructions[1] !== RuneStone.MAGIC_NUMBER) continue

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
