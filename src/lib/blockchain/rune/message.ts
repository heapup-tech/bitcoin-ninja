import { Transaction } from 'bitcoinjs-lib'
import Edict from './edict'
import Flaw from './flaw'
import Tag from './tag'
import varint from './varint'

function slicedChunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export default class Message {
  flaw?: Flaw
  edicts: Edict[] = []
  fields: Map<bigint, bigint[]> = new Map()
  static from_integers(tx: Transaction, payload: bigint[]) {
    const message = new Message()

    for (let i = 0; i < payload.length; i += 2) {
      let tag = payload[i]

      if (tag === BigInt(Tag.Body)) {
        // TODO
      }

      if (i + 1 >= payload.length) {
        message.flaw = Flaw.TruncatedField
        break
      } else {
        if (message.fields.has(tag)) {
          message.fields.get(tag)?.push(payload[i + 1])
        } else {
          message.fields.set(tag, [payload[i + 1]])
        }
      }
    }

    return message
  }

  static toBuffer(msg: Map<number, bigint[]>) {
    let buffArr: Buffer[] = []
    // Serialize fields.
    for (const [tag, vals] of msg) {
      for (const val of vals) {
        const tagBuff = Buffer.alloc(1)
        tagBuff.writeUInt8(tag)
        buffArr.push(tagBuff)
        buffArr.push(Buffer.from(varint.encode(val)))
      }
    }
    return Buffer.concat(buffArr)
  }
}
