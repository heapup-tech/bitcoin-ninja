import { Transaction } from 'bitcoinjs-lib'
import Edict from './edict'
import Flaw from './flaw'
import Tag from './tag'

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
}
