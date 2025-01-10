import { Transaction } from 'bitcoinjs-lib'
import { beforeEach, describe, expect, test } from 'vitest'
import Etching from './etching'
import Rune from './rune'
import RuneStone from './runestone'

// https://mempool.space/tx/5de61c4bceed97bf2a472341faffbd9addb7e6e2577262c9c44cd0dc4584152c
const mintTxhex =
  '01000000000101b278668ba22304e8fa9f60137eb22734a307648a2eb50686d8984617bb4e95130300000000ffffffff04220200000000000022512099933aaf8f604bcca931f5d785db96dfb760ab23fbdcc634a159c7a16533504c0000000000000000096a5d0614c0a23314370008000000000000160014e5cb2de82fd4c136218c67a310fde879344c1bef1e2402000000000022512099933aaf8f604bcca931f5d785db96dfb760ab23fbdcc634a159c7a16533504c014016fbd97a208e985559eacb89b1ca13984db91efb4b1d5884f09c5adcb25e465b354690b7364f3f74c50fbd0956a2c5bdae42da51fc9680e46ae5ffebd49dd00c00000000'

const etchTxhex =
  '020000000001010f0aaad2dc98d8d78e590241dbbeba32b42f7f1f53d36019375dcf44a7caa92e0000000000fdffffff0200000000000000001a6a5d17020304cbd7ba8ea6edb98401034406000a6408e80716012202000000000000225120b494169f485231b6f428d3ce782cdaccc6b6bfd5d1a45802b62848d1b74c04f10340dd938a4f68cd0179df02f37ad5a350572468ee63f9f6ebdc8fefee83b84efa1cebaff3a29906b74e1d14d3b9355cca2d3936c96edb77da91545632f6166f5dfe2e209f418961888118de863b65cf783c284605e9be32bfc8dbe175e215ded6884e3eac006308cbabce616ae708016821c0c9b936943078e50c2804d1c9dd4999a1f0f68adba8e0b04542530ad071f6d42e00000000'

describe('RuneStone Decipher', () => {
  let runestone: RuneStone
  beforeEach(async () => {
    runestone = new RuneStone()
    const tx = Transaction.fromHex(etchTxhex)
    runestone.decipher(tx)
  })

  test('decipher etching', () => {
    const etching = runestone.etching

    expect(etching?.premine).toBe(0n)
    expect(etching?.rune?.display()).toBe('THEBESTCHAIN')

    const symbol = Rune.fromSymbol('THEBESTCHAIN')
    expect(symbol.value).toBe(74563837945097163n)
  })

  test('decipher mint', () => {})
})

describe('RuneStone Encipher', () => {
  test('encipher', () => {
    const runestone = new RuneStone()

    const etching = new Etching()
    etching.divisibility = 1
    etching.premine = 0n
    etching.rune = new Rune(702n) // AAA
    etching.spacers = undefined
    etching.symbol = 'X'
    etching.turbo = false
    etching.terms = {
      cap: 100n,
      amount: 1000n,
      height: [undefined, undefined],
      offset: [undefined, undefined]
    }
    runestone.etching = etching
    const payload = runestone.encipher()

    // expect(payload).toBeDefined()
  })
})

// 6a5d0302be050401015805ffffffffffffffffffffffffffffffffffff0306ffffffffffffffffffffffffffffffffffff030affffffffffffffffffffffffffffffffffff0308808080808080808080020c808080808080808080020e80808080808080808002108080808080808080800212

// 6a5d4c71020304be050101055806ffffffffffffffffffffffffffffffffffff030affffffffffffffffffffffffffffffffffff0308ffffffffffffffffffffffffffffffffffff030cffffffffffffffffff010effffffffffffffffff0110ffffffffffffffffff0112ffffffffffffffffff01
