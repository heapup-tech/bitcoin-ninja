import { describe, test } from 'vitest'
import varint from './varint'

describe('VarInt', () => {
  test('decode', () => {})

  test('encode', () => {
    const payload: number[] = []
    varint.encode_to_vec(355n, payload)

    payload.forEach((b) => {
      console.log(b.toString(16))
    })
    console.log(payload)
  })
})
