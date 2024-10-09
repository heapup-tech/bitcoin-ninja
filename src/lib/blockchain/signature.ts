import ecc from '@bitcoinerlab/secp256k1'
import { initEccLib, script, Transaction } from 'bitcoinjs-lib'
import { ECPairFactory } from 'ecpair'
import { compileP2PKH, isP2TR, isP2WPKH, isP2WSH } from './script-utils'
const ECPair = ECPairFactory(ecc)

initEccLib(ecc)

export const checkSig = (
  pubkey: string,
  signature: string,
  txHex: string,
  inIndex: number,
  prevOutScript: string,
  amount: number
): boolean => {
  if (!txHex) return false
  const tx = Transaction.fromHex(txHex)

  const keypair = ECPair.fromPublicKey(Buffer.from(pubkey, 'hex'))

  const signatureBuffer = Buffer.from(signature, 'hex')
  const { signature: decodedSignature, hashType } =
    script.signature.decode(signatureBuffer)

  const prevOutScriptBuffer = Buffer.from(prevOutScript, 'hex')
  let signatureHash: Buffer | null = null

  if (tx.hasWitnesses()) {
    if (isP2WPKH(prevOutScript)) {
      let pubkeyHash = script.toASM(prevOutScriptBuffer).split(' ')[1]
      const outScript = compileP2PKH(pubkeyHash)
      signatureHash = tx.hashForWitnessV0(
        inIndex,
        Buffer.from(outScript, 'hex'),
        amount,
        hashType
      )
    } else if (isP2TR(prevOutScript)) {
      signatureHash = tx.hashForWitnessV1(
        inIndex,
        [prevOutScriptBuffer],
        [amount],
        hashType
      )
    }
  } else {
    signatureHash = tx.hashForSignature(inIndex, prevOutScriptBuffer, hashType)
  }

  if (!signatureHash) return false

  let isValid = false

  if (isP2TR(prevOutScript)) {
    isValid = keypair.verifySchnorr(signatureHash, decodedSignature)
  } else {
    isValid = keypair.verify(signatureHash, decodedSignature)
  }

  return isValid
}

export const checkMultiSig = (
  m: number,
  pubkeys: string[],
  signatures: string[],
  txHex: string,
  inIndex: number,
  prevOutScript: string,
  amount: number
): boolean => {
  if (!txHex) return false

  const tx = Transaction.fromHex(txHex)

  let sigIndex = 0
  let pubkeyIndex = 0

  while (sigIndex < m && pubkeyIndex < pubkeys.length) {
    const signature = Buffer.from(signatures[sigIndex], 'hex')
    const pubkey = Buffer.from(pubkeys[pubkeyIndex], 'hex')
    const { signature: decodedSignature, hashType } =
      script.signature.decode(signature)

    let signatureHash: Buffer | null = null

    if (tx.hasWitnesses()) {
      if (isP2WSH(prevOutScript)) {
        const inIndexWitness = tx.ins[inIndex].witness
        signatureHash = tx.hashForWitnessV0(
          inIndex,
          inIndexWitness[inIndexWitness.length - 1], // 赎回脚本
          amount,
          hashType
        )
      }
    } else {
      signatureHash = tx.hashForSignature(
        inIndex,
        Buffer.from(prevOutScript, 'hex'),
        hashType
      )
    }

    if (!signatureHash) return false
    const keypair = ECPair.fromPublicKey(pubkey)
    if (keypair.verify(signatureHash, decodedSignature)) {
      sigIndex++
    }
    pubkeyIndex++
  }

  const isValid = sigIndex === m

  return isValid
}

export const signInput = ({
  tx,
  inIndex,
  utxo
}: {
  tx: Transaction
  inIndex: number
  utxo: {
    script: string
    amount: bigint
    type: Uppercase<ScriptType | 'unknown'>
  }
}) => {}
