import { script, Transaction } from 'bitcoinjs-lib'
import Edict from './edict'
import Etching from './etching'
import RuneId from './rune_id'

class RuneStone {
  readonly MAGIC_NUMBER = 0x5d // OP_13
  readonly COMMIT_CONFIRMATIONS = 6

  edicts: Edict[] = []
  etching?: Etching
  mint?: RuneId
  pointer?: number

  decipher(transaction: Transaction) {
    // decipher the transaction
    const payload = this.payload(transaction)
  }

  encipher() {}

  payload(transaction: Transaction) {
    for (let i = 0; i < transaction.outs.length; i++) {
      const instructions = script.decompile(transaction.outs[i].script)

      if (!instructions) continue

      // 不是以 OP_RETURN + OP_13 开头的输出
      if (instructions[0] !== 0x6a) continue
      if (instructions[1] !== this.MAGIC_NUMBER) continue

      console.log('instructions', instructions)

      instructions.forEach((instruction, index) => {})
    }
  }

  integers(payload: Uint8Array) {}
}

// https://mempool.space/tx/5de61c4bceed97bf2a472341faffbd9addb7e6e2577262c9c44cd0dc4584152c
const hex =
  '01000000000101b278668ba22304e8fa9f60137eb22734a307648a2eb50686d8984617bb4e95130300000000ffffffff04220200000000000022512099933aaf8f604bcca931f5d785db96dfb760ab23fbdcc634a159c7a16533504c0000000000000000096a5d0614c0a23314370008000000000000160014e5cb2de82fd4c136218c67a310fde879344c1bef1e2402000000000022512099933aaf8f604bcca931f5d785db96dfb760ab23fbdcc634a159c7a16533504c014016fbd97a208e985559eacb89b1ca13984db91efb4b1d5884f09c5adcb25e465b354690b7364f3f74c50fbd0956a2c5bdae42da51fc9680e46ae5ffebd49dd00c00000000'

const runestone = new RuneStone()
const tx = Transaction.fromHex(hex)

runestone.decipher(tx)
