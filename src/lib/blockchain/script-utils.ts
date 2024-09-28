import { script } from 'bitcoinjs-lib'
import { OPS } from 'bitcoinjs-lib/src/ops'
import { toHex } from 'uint8array-tools'

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

export const getScriptType = (script: string): ScriptType | 'unknown' => {
  if (isP2PKH(script)) return 'p2pkh'
  else if (isP2SH(script)) return 'p2sh'
  else if (isP2WPKH(script)) return 'p2wpkh'
  else if (isP2WSH(script)) return 'p2wsh'
  else if (isP2TR(script)) return 'p2tr'
  else return 'unknown'
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
