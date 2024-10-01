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
