export const getEccFormula = (a: number, b: number, p?: number) => {
  let axPart = ''
  let bPart = ''

  if (a !== 0) {
    let aSymbol = a > 0 ? '+' : '-'
    let aAbs = Math.abs(a)
    axPart = `${aSymbol} ${aAbs === 1 ? '' : aAbs}x`
  } else {
    axPart = ''
  }

  if (b !== 0) {
    let bSymbol = b > 0 ? '+' : '-'
    let bAbs = Math.abs(b)
    bPart = `${bSymbol} ${bAbs}`
  } else {
    bPart = ''
  }

  return `y^2 = x^3 ${axPart} ${bPart} ${p ? `\\ mod \\ ${p}` : ''}`
}

export const isPrime = (n: number) => {
  if (n <= 1) return false
  if (n <= 3) return true
  if (n % 2 === 0 || n % 3 === 0) return false

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false
  }

  return true
}
