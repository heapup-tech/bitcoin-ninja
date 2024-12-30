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
    const runestone = new RuneStone()

    // decipher the transaction
    const payload = this.payload(transaction)
    if (!payload) return

    console.log(payload)

    const integers = this.integers(payload)

    console.log(integers)

    const { flaw, edicts, fields } = Message.from_integers(
      transaction,
      integers
    )

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
      runestone.etching = etching
    }

    const [block, tx] = fields.get(BigInt(Tag.Mint)) ?? []

    if (block && tx) {
      runestone.mint = new RuneId(Number(block), Number(tx))
    }

    const pointer = fields.get(BigInt(Tag.Pointer))?.[0]
    if (pointer) {
      runestone.pointer = Number(pointer)
    }
    console.log(runestone)
    return runestone
  }

  encipher() {}

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
      console.log(`remain:`, payload.subarray(i))

      const { n: integer, i: length } = varint.decode(payload.subarray(i))

      console.log(`integer: ${integer}-----length: ${length}`)

      integers.push(integer)
      i += length
    }

    return integers
  }
}

// https://mempool.space/tx/5de61c4bceed97bf2a472341faffbd9addb7e6e2577262c9c44cd0dc4584152c
const mintTxhex =
  '01000000000101b278668ba22304e8fa9f60137eb22734a307648a2eb50686d8984617bb4e95130300000000ffffffff04220200000000000022512099933aaf8f604bcca931f5d785db96dfb760ab23fbdcc634a159c7a16533504c0000000000000000096a5d0614c0a23314370008000000000000160014e5cb2de82fd4c136218c67a310fde879344c1bef1e2402000000000022512099933aaf8f604bcca931f5d785db96dfb760ab23fbdcc634a159c7a16533504c014016fbd97a208e985559eacb89b1ca13984db91efb4b1d5884f09c5adcb25e465b354690b7364f3f74c50fbd0956a2c5bdae42da51fc9680e46ae5ffebd49dd00c00000000'

const etchTxhex =
  '020000000001010f0aaad2dc98d8d78e590241dbbeba32b42f7f1f53d36019375dcf44a7caa92e0000000000fdffffff0200000000000000001a6a5d17020304cbd7ba8ea6edb98401034406000a6408e80716012202000000000000225120b494169f485231b6f428d3ce782cdaccc6b6bfd5d1a45802b62848d1b74c04f10340dd938a4f68cd0179df02f37ad5a350572468ee63f9f6ebdc8fefee83b84efa1cebaff3a29906b74e1d14d3b9355cca2d3936c96edb77da91545632f6166f5dfe2e209f418961888118de863b65cf783c284605e9be32bfc8dbe175e215ded6884e3eac006308cbabce616ae708016821c0c9b936943078e50c2804d1c9dd4999a1f0f68adba8e0b04542530ad071f6d42e00000000'

const runestone = new RuneStone()
const tx = Transaction.fromHex(etchTxhex)

runestone.decipher(tx)
