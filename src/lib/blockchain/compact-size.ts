export const parserCompactSize = (
  hex: string,
  offset: number
): {
  offset: number
  section: string
  numberValue: number
  bigIntValue: bigint
} => {
  let buffer = Buffer.from(hex, 'hex')
  let section = hex.slice(offset, offset + 2)

  let decodedSection: number | bigint = buffer.readUInt8(offset / 2)

  const prefix = hex.slice(offset, offset + 2).toLowerCase()
  if (prefix === 'fd') {
    section = hex.slice(offset, offset + 6)
    decodedSection = buffer.readUInt16LE(offset / 2)
    offset += 6
  } else if (prefix === 'fe') {
    section = hex.slice(offset, offset + 10)
    decodedSection = buffer.readUInt32LE(offset / 2)
    offset += 10
  } else if (prefix === 'ff') {
    section = hex.slice(offset, offset + 18)
    decodedSection = buffer.readBigUint64LE(offset / 2)
    offset += 18
  } else {
    offset += 2
  }

  return {
    offset,
    section,
    numberValue:
      decodedSection <= Number.MAX_SAFE_INTEGER ? Number(decodedSection) : 0,
    bigIntValue: BigInt(decodedSection)
  }
}
