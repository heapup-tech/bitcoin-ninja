const COLORS = [
  'text-emerald-500',
  'text-amber-500',
  'text-violet-500',
  'text-pink-500',
  'text-blue-500',
  'text-lime-500',
  'text-teal-500',
  'text-fuchsia-500',
  'text-rose-500'
]

export const GETCOLORS = (index: number) => {
  return COLORS[index % COLORS.length]
}

const BGCOLORS = [
  'bg-emerald-200 dark:bg-emerald-500',
  'bg-amber-200 dark:bg-amber-500',
  'bg-violet-200 dark:bg-violet-500',
  'bg-pink-200 dark:bg-pink-500',
  'bg-blue-200 dark:bg-blue-500',
  'bg-lime-200 dark:bg-lime-500',
  'bg-teal-200 dark:bg-teal-500',
  'bg-fuchsia-200 dark:bg-fuchsia-500',
  'bg-rose-200 dark:bg-rose-500'
]
export const GETBGCOLORS = (index: number) => {
  return BGCOLORS[index % BGCOLORS.length]
}

const HOVERBGCOLORS = [
  'hover:bg-emerald-100',
  'hover:bg-amber-100',
  'hover:bg-violet-100',
  'hover:bg-pink-100',
  'hover:bg-blue-100',
  'hover:bg-lime-100',
  'hover:bg-teal-100',
  'hover:bg-fuchsia-100',
  'hover:bg-rose-100'
]

export const GETHOVERBGCOLORS = (index: number) => {
  return HOVERBGCOLORS[index % HOVERBGCOLORS.length]
}

export const ADDRESS_BASE58_PREFIX = {
  mainnet: {
    p2pkh: 0x00,
    p2sh: 0x05
  },
  testnet: {
    p2pkh: 0x6f,
    p2sh: 0xc4
  }
} as const

export const ADDRESS_BECH32_PREFIX = {
  mainnet: 'bc',
  testnet: 'tb',
  regtest: 'bcrt'
}

export const WIF_PREFIX = {
  mainnet: 0x80,
  testnet: 0xef
}

export const HALFING_INTERVAL = 210000
export const INITIAL_SUBSIDY = 50 * 1e8
export const SCRIPTS: Array<ScriptType> = [
  'p2pk',
  'p2pkh',
  'p2ms',
  'p2sh',
  'p2wpkh',
  'p2wsh',
  'p2tr'
]
