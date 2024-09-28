import { HALFING_INTERVAL, INITIAL_SUBSIDY } from '../constants'

export const subsidy = (height: number) => {
  const halvings = Math.floor(height / HALFING_INTERVAL)

  if (halvings >= 64) {
    return 0n
  }

  return BigInt(INITIAL_SUBSIDY) >> BigInt(halvings)
}
