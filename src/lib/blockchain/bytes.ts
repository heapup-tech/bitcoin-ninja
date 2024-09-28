export const reverseBytes = (bytes: Uint8Array): Uint8Array => {
  const result = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    result[i] = bytes[bytes.length - i - 1]
  }
  return result
}
