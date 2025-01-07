import { script, Transaction } from 'bitcoinjs-lib'
import Edict from './edict'
import Etching from './etching'
import { Flag, FlagManger } from './flag'
import Message from './message'
import Rune from './rune'
import RuneId from './rune_id'
import Tag from './tag'
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
    let fields: Map<Tag, bigint[]> = new Map()

    const flagManger = new FlagManger(0n)
    if (this.etching) {
      flagManger.set(Flag.Etching)

      if (this.etching.terms) {
        flagManger.set(Flag.Terms)
      }
      if (this.etching.turbo) {
        flagManger.set(Flag.Turbo)
      }
      fields.set(Tag.Flags, [flagManger.flags])

      if (this.etching.rune) {
        fields.set(Tag.Rune, [this.etching.rune.value])
      }

      if (this.etching.divisibility) {
        fields.set(Tag.Divisibility, [BigInt(this.etching.divisibility)])
      }

      if (this.etching.spacers) {
        fields.set(Tag.Spacers, [BigInt(this.etching.spacers)])
      } else {
        let spacers = this.etching.rune?.spacer || 0n
        spacers !== 0n && fields.set(Tag.Spacers, [spacers])
      }

      if (this.etching.symbol) {
        fields.set(Tag.Symbol, [BigInt(this.etching.symbol.charCodeAt(0))])
      }

      if (this.etching.premine) {
        fields.set(Tag.Premine, [this.etching.premine])
      }

      if (this.etching.terms) {
        if (this.etching.terms.amount) {
          fields.set(Tag.Amount, [this.etching.terms.amount])
        }
        if (this.etching.terms.cap) {
          fields.set(Tag.Cap, [this.etching.terms.cap])
        }
        if (this.etching.terms.height) {
          if (this.etching.terms.height[0] !== undefined) {
            fields.set(Tag.HeightStart, [BigInt(this.etching.terms.height[0])])
          }

          if (this.etching.terms.height[1] !== undefined) {
            fields.set(Tag.HeightEnd, [BigInt(this.etching.terms.height[1])])
          }
        }

        if (this.etching.terms.offset) {
          if (this.etching.terms.offset[0] !== undefined) {
            fields.set(Tag.OffsetStart, [BigInt(this.etching.terms.offset[0])])
          }

          if (this.etching.terms.offset[1] !== undefined) {
            fields.set(Tag.OffsetEnd, [BigInt(this.etching.terms.offset[1])])
          }
        }
      }
    }

    console.log(fields)

    let buffArr: Buffer[] = []
    // Serialize fields.
    for (const [tag, vals] of fields) {
      for (const val of vals) {
        const tagBuff = Buffer.alloc(1)
        tagBuff.writeUInt8(tag)
        buffArr.push(tagBuff)
        buffArr.push(Buffer.from(varint.encode(val)))
      }
    }
    let msgBuff = Buffer.concat(buffArr)

    const prefix = Buffer.from('6a5d', 'hex') // OP_RETURN OP_13
    let pushNum
    if (msgBuff.length < 0x4c) {
      pushNum = Buffer.alloc(1)
      pushNum.writeUInt8(msgBuff.length)
    } else if (msgBuff.length < 0x100) {
      pushNum = Buffer.alloc(2)
      pushNum.writeUInt8(0x4c)
      pushNum.writeUInt8(msgBuff.length, 1)
    } else if (msgBuff.length < 0x10000) {
      pushNum = Buffer.alloc(3)
      pushNum.writeUInt8(0x4d)
      pushNum.writeUInt16LE(msgBuff.length, 1)
    } else if (msgBuff.length < 0x100000000) {
      pushNum = Buffer.alloc(5)
      pushNum.writeUInt8(0x4e)
      pushNum.writeUInt32LE(msgBuff.length, 1)
    } else {
      throw new Error('runestone too big!')
    }

    console.log(msgBuff.toString('hex'))

    return script.compile(Buffer.concat([prefix, pushNum, msgBuff]))
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
