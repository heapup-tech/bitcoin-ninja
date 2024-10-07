import { Network, networks, payments, script } from 'bitcoinjs-lib'
import {
  Base58CheckResult,
  Bech32Result,
  fromBase58Check,
  fromBech32
} from 'bitcoinjs-lib/src/address'
import { OPS } from 'bitcoinjs-lib/src/ops'
import { toHex } from 'uint8array-tools'

const FUTURE_SEGWIT_MAX_SIZE: number = 40
const FUTURE_SEGWIT_MIN_SIZE: number = 2
const FUTURE_SEGWIT_MAX_VERSION: number = 16
const FUTURE_SEGWIT_MIN_VERSION: number = 2
const FUTURE_SEGWIT_VERSION_DIFF: number = 0x50
const FUTURE_SEGWIT_VERSION_WARNING: string =
  'WARNING: Sending to a future segwit version address can lead to loss of funds. ' +
  'End users MUST be warned carefully in the GUI and asked if they wish to proceed ' +
  'with caution. Wallets should verify the segwit version from the output of fromBech32, ' +
  'then decide when it is safe to use which version of segwit.'

export const isP2PKH = (script: string): boolean => {
  return script.startsWith('76a914') && script.endsWith('88ac')
}

export const isP2SH = (script: string): boolean => {
  return script.startsWith('a914') && script.endsWith('87')
}

export const isP2WPKH = (script: string): boolean => {
  return script.startsWith('0014') && script.length === 44
}

export const isP2WSH = (script: string): boolean => {
  return script.startsWith('0020') && script.length === 68
}

export const isP2TR = (script: string): boolean => {
  return script.startsWith('5221') && script.endsWith('ae')
}

export const getScriptType = (
  script: string
): Uppercase<ScriptType | 'unknown'> => {
  if (isP2PKH(script)) return 'P2PKH'
  else if (isP2SH(script)) return 'P2SH'
  else if (isP2WPKH(script)) return 'P2WPKH'
  else if (isP2WSH(script)) return 'P2WSH'
  else if (isP2TR(script)) return 'P2TR'
  else return 'UNKNOWN'
}

export const isWitness = (script: string): boolean => {
  return isP2WPKH(script) || isP2WSH(script) || isP2TR(script)
}

export const compileP2PKH = (pubkeyHash: string): string => {
  const p2pkhOutScript = script.compile([
    OPS.OP_DUP,
    OPS.OP_HASH160,
    Buffer.from(pubkeyHash, 'hex'),
    OPS.OP_EQUALVERIFY,
    OPS.OP_CHECKSIG
  ])

  return toHex(p2pkhOutScript)
}

export const compileP2WSH = (scriptHash: string): string => {
  const p2pkhOutScript = script.compile([
    OPS.OP_SHA256,
    Buffer.from(scriptHash, 'hex'),
    OPS.OP_EQUAL
  ])

  return toHex(p2pkhOutScript)
}

// @ts-ignore
export function toOutputScript(address: string, network?: Network): Uint8Array {
  network = network || networks.bitcoin

  let decodeBase58: Base58CheckResult | undefined
  let decodeBech32: Bech32Result | undefined
  try {
    decodeBase58 = fromBase58Check(address)
  } catch (e) {}

  if (decodeBase58) {
    if (decodeBase58.version === network.pubKeyHash)
      return payments.p2pkh({ hash: decodeBase58.hash }).output as Uint8Array
    if (decodeBase58.version === network.scriptHash)
      return payments.p2sh({ hash: decodeBase58.hash }).output as Uint8Array
  } else {
    try {
      decodeBech32 = fromBech32(address)
    } catch (e) {}

    if (decodeBech32) {
      if (decodeBech32.prefix !== network.bech32)
        throw new Error(address + ' has an invalid prefix')
      if (decodeBech32.version === 0) {
        if (decodeBech32.data.length === 20)
          return payments.p2wpkh({ hash: decodeBech32.data })
            .output as Uint8Array
        if (decodeBech32.data.length === 32)
          return payments.p2wsh({ hash: decodeBech32.data })
            .output as Uint8Array
      } else if (decodeBech32.version === 1) {
        if (decodeBech32.data.length === 32)
          return payments.p2tr({ pubkey: decodeBech32.data })
            .output as Uint8Array
      } else if (
        decodeBech32.version >= FUTURE_SEGWIT_MIN_VERSION &&
        decodeBech32.version <= FUTURE_SEGWIT_MAX_VERSION &&
        decodeBech32.data.length >= FUTURE_SEGWIT_MIN_SIZE &&
        decodeBech32.data.length <= FUTURE_SEGWIT_MAX_SIZE
      ) {
        console.warn(FUTURE_SEGWIT_VERSION_WARNING)

        return script.compile([
          decodeBech32.version + FUTURE_SEGWIT_VERSION_DIFF,
          decodeBech32.data
        ])
      }
    }
  }
}
