/**
 * varint(LEB128) 原理:
 * 每个字节的最高位(第8位)用作标志位, 2 表示后面还有数据, 0 表示当前字节是最后一个字节
 * 每个字节的低7位用作存储数据, 7位最大值为 127
 *
 * 编码举例:
 * 整数 210 的二进制表示为 11010010
 * 从右向左每7位分组 第一组: 1010010 第二组: 0000001
 * 每个字节添加标志位 1+1010010 0+0000001
 * 最后结果为: 11010010 00000001 转成16进制 0xD2 0x01
 *
 * 解码举例:
 * 已知 0xD2 0x01 转成二进制 11010010 00000001
 * 第一个字节的标志位是1, 表明后面数据, 低7位是 1010010 转成十进制是 82
 * 第二个字节的标志位是0, 表明没有后续数据, 低7位是 0000001
 * 还原: 第二个字节左移7位得到 10000000,
 * 与第一个字节或运算 10000000 | 01010010 = 11010010 转成十进制是 210
 */

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

const encode = (n: bigint) => {
  let v: number[] = []
  encode_to_vec(n, v)

  return v
}

const encode_to_vec = (n: bigint, v: number[]) => {
  // 判断 n 是否大于 127(依据右移7位是否大于0), 大于说明需要留出一位表示还有剩余值
  while (n >> 7n > 0) {
    let byte = Number(n & 0x7fn) | 0b1000_0000
    v.push(byte)
    n >>= 7n
  }
  v.push(Number(n))
}

const varint = {
  decode,
  encode,
  encode_to_vec
}
export default varint
