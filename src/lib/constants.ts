import { networks } from 'bitcoinjs-lib'
import { fromHex } from 'uint8array-tools'

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

export const NETWORKS = {
  mainnet: {
    label: '主网',
    network: networks.bitcoin
  },
  testnet: {
    label: '测试网',
    network: networks.testnet
  },
  regtest: {
    label: '回归测试网',
    network: networks.regtest
  }
} as const

export const SIGHASHES = {
  default: {
    name: 'SIGHASH_DEFAULT',
    value: 0x00
  },
  all: {
    name: 'SIGHASH_ALL',
    value: 0x01
  },
  none: {
    name: 'SIGHASH_NONE',
    value: 0x02
  },
  single: {
    name: 'SIGHASH_SINGLE',
    value: 0x03
  },
  allAnyoneCanPay: {
    name: 'SIGHASH_ALL | SIGHASH_ANYONECANPAY',
    value: 0x81
  },
  noneAnyoneCanPay: {
    name: 'SIGHASH_NONE | SIGHASH_ANYONECANPAY',
    value: 0x82
  },
  singleAnyoneCanPay: {
    name: 'SIGHASH_SINGLE | SIGHASH_ANYONECANPAY',
    value: 0x83
  }
} as const

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

export type ENT = 128 | 160 | 192 | 224 | 256

// mnemonic entropy length
export const ENTROPYWORDMAP: Record<ENT, string> = {
  128: '12',
  160: '15',
  192: '18',
  224: '21',
  256: '24'
}

export const MNEMONIC_LANGUAGES = [
  {
    name: 'English',
    value: 'english'
  },
  {
    name: '中文简体',
    value: 'chinese_simplified'
  },
  {
    name: '中文繁体',
    value: 'chinese_traditional'
  },
  {
    name: '捷克语',
    value: 'czech'
  },
  {
    name: '日语',
    value: 'japanese'
  },
  {
    name: '韩语',
    value: 'korean'
  },
  {
    name: '法语',
    value: 'french'
  },
  {
    name: '意大利语',
    value: 'italian'
  },
  {
    name: '西班牙语',
    value: 'spanish'
  },
  {
    name: '葡萄牙语',
    value: 'portuguese'
  }
]

export const EMPTY_BUFFER = new Uint8Array(0)
export const EMPTY_WITNESS: Uint8Array[] = []
export const ZERO = fromHex(
  '0000000000000000000000000000000000000000000000000000000000000000'
)
export const ONE = fromHex(
  '0000000000000000000000000000000000000000000000000000000000000001'
)

export const VALUE_UINT64_MAX = fromHex('ffffffffffffffff')
export const BLANK_OUTPUT = {
  script: EMPTY_BUFFER,
  valueBuffer: VALUE_UINT64_MAX
}
