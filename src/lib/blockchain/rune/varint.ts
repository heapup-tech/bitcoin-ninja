const decode = (buffer: Buffer) => {
  let n = 0n

  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i]

    if (i > 18) {
      throw new Error('VarInt too big')
    }

    const value = BigInt(byte & 0b0111_1111)
    if (i === 18 && (value & 0b0111_1100n) !== 0n) {
      throw new Error('VarInt too big')
    }

    n |= value << BigInt(7 * i)

    if ((byte & 0b1000_0000) === 0) {
      return { n, i: i + 1 }
    }
  }

  throw new Error('Unterminated VarInt')
}

const varint = {
  decode
}
export default varint
