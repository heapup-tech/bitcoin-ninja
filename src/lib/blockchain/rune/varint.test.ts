import { describe, expect, test } from 'vitest'
import varint from './varint'

// origin: 2,3,4,74563837945097163,3,68,6,0,10,100,8,1000,22,1
// encoded: 020304cbd7ba8ea6edb98401034406000a6408e8071601

describe('VarInt', () => {
  test('decode', () => {
    // expect(i).toBe(11)
  })

  test('encode', () => {
    const payload: number[] = []
    varint.encode_to_vec(355n, payload)

    expect(payload).toEqual([227, 2])
  })
})
