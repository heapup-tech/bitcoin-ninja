export const isHexadecimal = (hex: string, minLength = 0, maxLength = 0) => {
  const hexRegex = /^[0-9A-Fa-f]+$/
  if (!hexRegex.test(hex)) return false
  if (hex.length % 2 !== 0) return false
  if (minLength && hex.length < minLength) return false
  if (maxLength && hex.length > maxLength) return false
  return true
}

export const isValidPrivateKey = (privateKey: string) => {
  return isHexadecimal(privateKey, 64, 64)
}

export const isCompressedPublicKey = (publicKey: string) => {
  return (
    (publicKey.startsWith('02') || publicKey.startsWith('03')) &&
    isHexadecimal(publicKey, 66, 66)
  )
}
