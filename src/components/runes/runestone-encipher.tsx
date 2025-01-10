// 'use client'
import Etching from '@/lib/blockchain/rune/etching'
import Rune from '@/lib/blockchain/rune/rune'
import RuneStone from '@/lib/blockchain/rune/runestone'

export const uint128Max = (BigInt(1) << BigInt(128)) - BigInt(1)
export const uint64Max = (BigInt(1) << BigInt(64)) - BigInt(1)

export default function RunestoneEncipher() {
  let runestone = new RuneStone()

  const etching = new Etching()
  etching.divisibility = 38
  etching.premine = 1n
  etching.rune = Rune.fromSymbol('AAAAA•BBBB•DTGSUHD•AAAA•ZZZZ•A')
  etching.symbol = 'X'
  etching.terms = {
    amount: uint64Max,
    cap: uint64Max,
    height: [uint64Max, uint64Max],
    offset: [uint64Max, uint64Max]
  }
  runestone.etching = etching

  let fileds = runestone.encipher()

  return (
    <div>
      <h1>Runestone Encipher</h1>
    </div>
  )
}
