export const truncateAddress = (
  address?: string,
  start: number = 5,
  end: number = 5,
  separator: string = '...'
) => {
  if (!address) return ''

  const truncateRegex = new RegExp(
    `^([a-zA-Z0-9]{${start}})[a-zA-Z0-9]+([a-zA-Z0-9]{${end}})$`
  )

  const match = address.match(truncateRegex)

  if (!match) return address
  return `${match[1]}${separator}${match[2]}`
}

export function formatUnits(
  amount: bigint,
  decimals: number,
  truncate?: boolean,
  truncateLength: number = 2
) {
  let amountStr = amount.toString().padStart(decimals, '0')

  const integer = amountStr.slice(0, amountStr.length - decimals)
  let fraction = amountStr.slice(amountStr.length - decimals)

  if (truncate) {
    if (fraction.length > truncateLength)
      fraction = fraction.slice(0, truncateLength)
    else fraction = fraction.padEnd(truncateLength, '0')
  }
  return `${integer || '0'}${fraction ? `.${fraction}` : ''}`
}
