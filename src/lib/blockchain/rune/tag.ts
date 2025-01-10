import varint from './varint'

enum Tag {
  Body = 0,
  Flags = 2,
  Rune = 4,
  Premine = 6,
  Cap = 8,
  Amount = 10,
  HeightStart = 12,
  HeightEnd = 14,
  OffsetStart = 16,
  OffsetEnd = 18,
  Mint = 20,
  Pointer = 22,
  Cenotaph = 126,
  Divisibility = 1,
  Spacers = 3,
  Symbol = 5,
  Nop = 127
}

export default Tag

export const tagEncode = (tag: Tag, values: bigint[], payload: number[]) => {
  values.forEach((value) => {
    varint.encode_to_vec(value, payload)
    varint.encode_to_vec(BigInt(tag), payload)
  })
}

export const tagEncodeOption = (tag: Tag, payload: number[], value?: any) => {
  if (!value) return
  tagEncode(tag, [BigInt(value)], payload)
}
