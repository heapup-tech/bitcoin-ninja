// import * as ecc from 'tiny-secp256k1'

// replace tiny-secp256k1 with @bitcoinerlab/secp256k1 [tiny-secp256k1 use wasm to calculate public key, but the wasm it's not working on vercel]
import ecc from '@bitcoinerlab/secp256k1'

// 计算公钥坐标点
export const calculatePublicKeyPoint = (privateKeyHex: string) => {
  // 未压缩公钥, 满足 04 + x + y
  const uncompressedPublicKey = ecc.pointFromScalar(
    Buffer.from(privateKeyHex, 'hex'),
    false
  )

  // 压缩公钥, 满足 02/03 + x  ()
  const compressedPublicKey = ecc.pointFromScalar(
    Buffer.from(privateKeyHex, 'hex'),
    true
  )

  if (!uncompressedPublicKey || !compressedPublicKey) {
    return {
      x: '0'.repeat(64),
      y: '0'.repeat(64),
      xHex: '0'.repeat(64),
      yHex: '0'.repeat(64),
      uncompressedPublicKey: '0'.repeat(130),
      compressedPublicKey: '0'.repeat(66)
    }
  }

  const x = Buffer.from(uncompressedPublicKey.slice(1, 33)).toString('hex')
  const y = Buffer.from(uncompressedPublicKey.slice(33, 66)).toString('hex')

  return {
    x: BigInt(`0x${x}`).toString(),
    y: BigInt(`0x${y}`).toString(),
    xHex: x,
    yHex: y,
    uncompressedPublicKey: Buffer.from(uncompressedPublicKey).toString('hex'),
    compressedPublicKey: Buffer.from(compressedPublicKey).toString('hex')
  }
}

export const generatePrivateKey = () => {
  const bits = Array.from({ length: 256 }, () => (Math.random() > 0.5 ? 1 : 0))

  const bigDecimalInt = BigInt(`0b${bits.join('')}`)
  const decimal = bigDecimalInt.toString()
  const hexadecimal = bigDecimalInt.toString(16).padStart(64, '0')

  return {
    bits,
    decimal,
    hexadecimal
  }
}
