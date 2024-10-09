export const reverseBytes = (bytes: Uint8Array): Uint8Array => {
  const result = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    result[i] = bytes[bytes.length - i - 1]
  }
  return result
}

function lpad(str: string, padString: string, length: number): string {
  while (str.length < length) {
    str = padString + str
  }
  return str
}

export const binaryToByte = (bin: string): number => {
  return parseInt(bin, 2)
}

export const bytesToBinary = (bytes: number[]): string => {
  return bytes.map((x: number): string => lpad(x.toString(2), '0', 8)).join('')
}

export const decimalToCompactHex = (decimal: number): string => {
  if (decimal < 0xfd) {
    return decimal.toString(16).padStart(2, '0')
  } else if (decimal <= 0xffff) {
    return 'fd' + decimal.toString(16).padStart(4, '0')
  } else if (decimal <= 0xffffffff) {
    return 'fe' + decimal.toString(16).padStart(8, '0')
  } else {
    return 'ff' + decimal.toString(16).padStart(16, '0')
  }
}

export const decimalToFixedByteHex = (
  decimal: number,
  size: number,
  littleEndian = false
) => {
  // const buffer = new ArrayBuffer(size)
  // new DataView(buffer).setUint32(0, decimal, littleEndian)
  // return toHex(new Uint8Array(buffer))

  // 确保 decimal 是非负整数
  const unsignedDecimal = decimal >>> 0

  // 转换为十六进制字符串并填充到指定大小
  let hex = unsignedDecimal.toString(16).padStart(size * 2, '0')

  // 如果结果超过指定大小，截取最后 size * 2 个字符
  hex = hex.slice(-size * 2)

  // 如果是小端序，反转字节顺序
  if (littleEndian) {
    hex = hex.match(/../g)!.reverse().join('')
  }

  return hex
}
