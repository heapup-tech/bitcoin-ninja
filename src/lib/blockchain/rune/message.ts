import { Transaction } from 'bitcoinjs-lib'
import Edict from './edict'
import Flaw from './flaw'

export default class Message {
  flaw?: Flaw
  edicts: Edict[] = []
  fields: Map<bigint, bigint[]> = new Map()
  static from_integers(tx: Transaction, payload: bigint[]) {
    const message = new Message()

    return message
  }
}
