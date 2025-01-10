/*
Script 6a0152060001e0f4061403906a00

Decoded {
    "rune": "R",
    "transfers": [
        {
            "id": 0,
            "output": 1,
            "amount": 21000000
        }
    ],
    "issueData": {
        "symbol": "jan",
        "decimals": 0
    }
}

*/

import { script } from 'bitcoinjs-lib'

class Rune {
  constructor(public value: number) {}

  public get name(): string {
    let x = this.value
    let name = ''
    while (x > 0) {
      name += 'abcdefghijklmnopqrstuvwxyz'.charAt((x - 1) % 26)
      x = Math.floor((x - 1) / 26)
    }
    return name.split('').reverse().join('')
  }

  public static fromName(s: string): Rune {
    s = s.toLowerCase()
    let x = 0
    for (const c of s) {
      if (c >= 'a' && c <= 'z') {
        x = x * 26 + c.charCodeAt(0) - 'a'.charCodeAt(0) + 1
      } else {
        throw new Error(`invalid character in sat name: ${c}`)
      }
    }
    return new Rune(x)
  }
}

function decodePrefixVarint(buf: Buffer): [number, bigint] {
  const firstByte = buf[0]

  switch (true) {
    case (firstByte & 128) === 0: // Leading ones: 0
      return [1, BigInt(firstByte)]

    case (firstByte & 192) === 128: // Leading ones: 1
      return [2, BigInt(firstByte & 0x3f) | (BigInt(buf[1]) << BigInt(6))]

    case (firstByte & 224) === 192: // Leading ones: 2
      return [
        3,
        BigInt(firstByte & 0x1f) |
          ((BigInt(buf[1]) | (BigInt(buf[2]) << BigInt(8))) << BigInt(5))
      ]

    case (firstByte & 240) === 224: // Leading ones: 3
      let value3 = BigInt(firstByte & 0x0f)
      value3 |=
        (BigInt(buf[1]) |
          (BigInt(buf[2]) << BigInt(8)) |
          (BigInt(buf[3]) << BigInt(16))) <<
        BigInt(4)
      return [4, value3]

    case (firstByte & 248) === 240: // Leading ones: 4
      let value4 = BigInt(firstByte & 0x07)
      value4 |= BigInt(buf.readUInt32LE(1)) << BigInt(3)
      return [5, value4]

    case (firstByte & 252) === 248: // Leading ones: 5
      return [
        6,
        BigInt(firstByte & 0x03) |
          ((BigInt(buf[1]) |
            (BigInt(buf[2]) << BigInt(8)) |
            (BigInt(buf[3]) << BigInt(16)) |
            (BigInt(buf[4]) << BigInt(24)) |
            (BigInt(buf[5]) << BigInt(32))) <<
            BigInt(2))
      ]
    case (firstByte & 254) === 252: // Leading ones: 6
      let value6 = BigInt(firstByte & 0x01)
      value6 |=
        (BigInt(buf.readUInt32LE(1)) |
          (BigInt(buf.readUInt16LE(5)) << BigInt(32))) <<
        BigInt(1)
      return [7, value6]

    case firstByte === 254: // Leading ones: 7
      const tempBuf = Buffer.alloc(8)
      tempBuf[0] = firstByte
      buf.copy(tempBuf, 1, 1, 8) // Copy next 7 bytes from buf into tempBuf starting from position 1
      return [8, tempBuf.readBigUInt64LE(0) >> BigInt(8)]

    case firstByte === 255: // Leading ones: 8
      return [9, buf.readBigUInt64LE(1)]

    default:
      throw new Error('Invalid prefix varint')
  }
}

export const decodeRuneScript = (runeScript: Buffer) => {
  const chunks = script.decompile(runeScript) as Buffer[]
  const rune = chunks[1].toString('ascii')
  const transfers = chunks[2] ? decodeTransfers(chunks[2]) : []
  const issueData = chunks[3] ? decodeIssueData(chunks[3]) : undefined

  return {
    rune,
    transfers,
    issueData
  }
}

const decodeTransfers = (buffer: Buffer) => {
  const transfers: {
    id: number
    output: number
    amount: number
  }[] = []

  let offset = 0
  while (offset < buffer.length) {
    const [idLength, id] = decodePrefixVarint(buffer.slice(offset))
    offset += idLength

    const [outputLength, output] = decodePrefixVarint(buffer.slice(offset))
    offset += outputLength

    const [amountLength, amount] = decodePrefixVarint(buffer.slice(offset))
    offset += amountLength

    transfers.push({
      id: Number(id),
      output: Number(output),
      amount: Number(amount)
    })
  }

  return transfers
}

const decodeIssueData = (buffer: Buffer) => {
  const [symbolLength, symbolValue] = decodePrefixVarint(buffer)
  const symbol = new Rune(Number(symbolValue)).name
  const [, decimals] = decodePrefixVarint(buffer.slice(symbolLength))

  return {
    symbol,
    decimals: Number(decimals)
  }
}

const decoded = decodeRuneScript(
  Buffer.from('6a0152060001e0f4061403906a00', 'hex')
)
