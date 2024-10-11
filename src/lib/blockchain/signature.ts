import { payments, script, Transaction } from 'bitcoinjs-lib'

import { sha256 } from '@noble/hashes/sha256'
import { hash256 } from 'bitcoinjs-lib/src/crypto'
import { toHex } from 'uint8array-tools'
import { BLANK_OUTPUT, EMPTY_BUFFER, ZERO } from '../constants'
import { decimalToCompactHex, decimalToFixedByteHex } from './bytes'
import ECPair from './ecpair'
import { compileP2PKH, isP2TR, isP2WPKH, isP2WSH } from './script-utils'

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

/**
 *
 * @param tx 未签名交易
 * @param inIndex 签名的输入索引
 * @param utxo inIndex 对应的 UTXO 信息, 包括 script、value、type
 * @param sigHashValue 哈希类型
 * @returns
 */
export const sigMsgForSignature = (
  tx: Transaction,
  inIndex: number,
  utxo: UTXO,
  sigHashValue: number
) => {
  const txTemp = tx.clone()

  // sigHash === SIGHASH_NONE
  if ((sigHashValue & 0x1f) === Transaction.SIGHASH_NONE) {
    // 清空输出
    txTemp.outs = []

    // 清空非签名输入的 sequence
    txTemp.ins.forEach((input, i) => {
      if (i === inIndex) return
      input.sequence = 0
    })
  } else if ((sigHashValue & 0x1f) === Transaction.SIGHASH_SINGLE) {
    // sigHash === SIGHASH_SINGLE

    // 如果输入索引大于输出数量, 抛出异常
    if (inIndex >= txTemp.outs.length) {
      throw new Error('Input index is out of range')
    }

    // 移除多余的输出
    txTemp.outs.length = inIndex + 1

    // 设置非签名输入的索引对应的输出的 amount 为最大值, `scriptPubKey` 为空
    for (let i = 0; i < inIndex; i++) {
      ;(txTemp.outs as any)[i] = BLANK_OUTPUT
    }

    // 清空非签名输入的 sequence
    txTemp.ins.forEach((input, i) => {
      if (i === inIndex) return
      input.sequence = 0
    })
  }

  if (sigHashValue & Transaction.SIGHASH_ANYONECANPAY) {
    // 只保留当前要签名的输入
    txTemp.ins = [txTemp.ins[inIndex]]
    // 设置 `scriptSig` 为 `scriptPubKey`
    txTemp.ins[0].script = Buffer.from(utxo.script, 'hex')
  } else {
    // SIGHASH_ALL

    // 所有输入的 `scriptSig` 字段设置为空
    txTemp.ins.forEach((input) => {
      input.script = Buffer.from('')
    })
    // 设置当前要签名的输入的 `scriptSig` 为 `scriptPubKey`
    txTemp.ins[inIndex].script = Buffer.from(utxo.script, 'hex')
  }

  return txTemp
}

export const sigMsgForWitnessV0 = (
  tx: Transaction,
  inIndex: number,
  utxo: UTXO,
  sigHashValue: number
) => {
  const txTemp = tx.clone()

  let hashOutputs = ZERO
  let hashPrevouts = ZERO
  let hashSequence = ZERO

  if (!(sigHashValue & Transaction.SIGHASH_ANYONECANPAY)) {
    const txidAndVouts = tx.ins.reduce((acc, input) => {
      const txid = toHex(input.hash)
      const vout = decimalToFixedByteHex(Number(input.index), 4, true)

      return acc + txid + vout
    }, '')
    hashPrevouts = hash256(Buffer.from(txidAndVouts, 'hex'))
  }

  if (
    !(sigHashValue & Transaction.SIGHASH_ANYONECANPAY) &&
    (sigHashValue & 0x1f) !== Transaction.SIGHASH_SINGLE &&
    (sigHashValue & 0x1f) !== Transaction.SIGHASH_NONE
  ) {
    const sequences = tx.ins.reduce((acc, input) => {
      const sequence = decimalToFixedByteHex(Number(input.sequence), 4, true)
      return acc + sequence
    }, '')
    hashSequence = hash256(Buffer.from(sequences, 'hex'))
  }

  if (
    (sigHashValue & 0x1f) !== Transaction.SIGHASH_SINGLE &&
    (sigHashValue & 0x1f) !== Transaction.SIGHASH_NONE
  ) {
    const amountsAndScriptPubKeys = tx.outs.reduce((acc, output) => {
      const amount = decimalToFixedByteHex(Number(output.value), 8, true)
      const scriptPubKeySize = decimalToCompactHex(output.script.length)
      const scriptPubKey = toHex(output.script)
      return acc + amount + scriptPubKeySize + scriptPubKey
    }, '')
    hashOutputs = hash256(Buffer.from(amountsAndScriptPubKeys, 'hex'))
  } else if (
    (sigHashValue & 0x1f) === Transaction.SIGHASH_SINGLE &&
    inIndex < txTemp.outs.length
  ) {
    const output = txTemp.outs[inIndex]

    const amount = decimalToFixedByteHex(Number(output.value), 8, true)
    const scriptPubKeySize = decimalToCompactHex(output.script.length)
    const scriptPubKey = toHex(output.script)

    hashOutputs = hash256(
      Buffer.from(amount + scriptPubKeySize + scriptPubKey, 'hex')
    )
  }

  // Combine Fields
  const input = txTemp.ins[inIndex]

  const version = Buffer.from(decimalToFixedByteHex(tx.version, 4, true), 'hex')
  const lockTime = Buffer.from(
    decimalToFixedByteHex(Number(tx.locktime), 4, true),
    'hex'
  )

  const vout = Buffer.from(
    decimalToFixedByteHex(Number(input.index), 4, true),
    'hex'
  )
  const amount = Buffer.from(
    decimalToFixedByteHex(Number(utxo.amount), 8, true),
    'hex'
  )

  let prevOut: Buffer<ArrayBufferLike> = Buffer.from(utxo.script, 'hex')
  if (utxo.type === 'P2WPKH') {
    prevOut = payments.p2pkh({
      hash: Buffer.from(utxo.script, 'hex').subarray(2)
    }).output!
  }

  const prevOutSize = Buffer.from(decimalToCompactHex(prevOut.length), 'hex')
  const sequence = Buffer.from(
    decimalToFixedByteHex(Number(input.sequence), 4, true),
    'hex'
  )

  console.log(`hashPrevouts: ${toHex(hashPrevouts)} \n`)
  console.log(`hashSequence: ${toHex(hashSequence)} \n`)
  console.log(`hashOutputs: ${toHex(hashOutputs)} \n`)

  const sigMsg = Buffer.concat([
    version,
    hashPrevouts,
    hashSequence,
    input.hash,
    vout,
    prevOutSize,
    prevOut,
    amount,
    sequence,
    hashOutputs,
    lockTime
  ])

  return {
    sigMsg,
    version,
    hashPrevouts,
    hashSequence,
    inputHash: input.hash,
    vout,
    prevOutSize,
    prevOut,
    amount,
    sequence,
    hashOutputs,
    lockTime
  }
}

export const sigMsgForWitnessV1 = (
  tx2: Transaction,
  inIndex: number,
  utxos: UTXO[],
  sigHashValue: number
) => {
  const txTemp = tx2.clone()

  const outputType =
    sigHashValue === Transaction.SIGHASH_DEFAULT
      ? Transaction.SIGHASH_ALL
      : sigHashValue & Transaction.SIGHASH_OUTPUT_MASK

  const inputType = sigHashValue & Transaction.SIGHASH_INPUT_MASK

  const isAnyoneCanPay = inputType === Transaction.SIGHASH_ANYONECANPAY
  const isNone = outputType === Transaction.SIGHASH_NONE
  const isSingle = outputType === Transaction.SIGHASH_SINGLE

  let hashPrevouts: Uint8Array<ArrayBufferLike> = EMPTY_BUFFER
  let hashAmounts: Uint8Array<ArrayBufferLike> = EMPTY_BUFFER
  let hashScriptPubKeys: Uint8Array<ArrayBufferLike> = EMPTY_BUFFER
  let hashSequences: Uint8Array<ArrayBufferLike> = EMPTY_BUFFER
  let hashOutputs: Uint8Array<ArrayBufferLike> = EMPTY_BUFFER

  if (!isAnyoneCanPay) {
    // 1. hashPrevouts = sha256(txid0 + vout0 + txid1 + vout1 + ...)
    const txidAndVouts = txTemp.ins.reduce((acc, input) => {
      const txid = toHex(input.hash)
      const vout = decimalToFixedByteHex(Number(input.index), 4, true)

      return acc + txid + vout
    }, '')
    hashPrevouts = sha256(Buffer.from(txidAndVouts, 'hex'))

    // 2. hashAmounts = sha256(amount0 + amount1 + ...)
    const allAmounts = txTemp.ins.reduce((acc, input, index) => {
      const amount = decimalToFixedByteHex(Number(utxos[index].amount), 8, true)
      return acc + amount
    }, '')
    hashAmounts = sha256(Buffer.from(allAmounts, 'hex'))

    // 3. hashScriptPubKeys = sha256(scriptPubKeySize0 + scriptPubKey0 + scriptPubKeySize1 + scriptPubKey1 + ...)
    const allScriptPubKeys = utxos.reduce((acc, utxo) => {
      const scriptPubKeySize = decimalToCompactHex(utxo.script.length / 2)
      return acc + scriptPubKeySize + utxo.script
    }, '')
    hashScriptPubKeys = sha256(Buffer.from(allScriptPubKeys, 'hex'))

    // 4. hashSequence = sha256(sequence0 + sequence1 + ...)
    const sequences = txTemp.ins.reduce((acc, input) => {
      const sequence = decimalToFixedByteHex(Number(input.sequence), 4, true)
      return acc + sequence
    }, '')
    hashSequences = sha256(Buffer.from(sequences, 'hex'))
  }

  if (!(isNone || isSingle)) {
    if (!txTemp.outs.length) {
      throw new Error('No outputs')
    }

    // 5. hashOutputs = sha256(amount0 + scriptPubKeySize0 + scriptPubKey0 + amount1 + scriptPubKeySize1 + scriptPubKey1 + ...)

    const amountsAndScriptPubKeys = txTemp.outs.reduce((acc, output) => {
      const amount = decimalToFixedByteHex(Number(output.value), 8, true)
      const scriptPubKeySize = decimalToCompactHex(output.script.length)
      const scriptPubKey = toHex(output.script)
      return acc + amount + scriptPubKeySize + scriptPubKey
    }, '')
    hashOutputs = sha256(Buffer.from(amountsAndScriptPubKeys, 'hex'))
  } else if (isSingle && inIndex < txTemp.outs.length) {
    const output = txTemp.outs[inIndex]

    const amount = decimalToFixedByteHex(Number(output.value), 8, true)
    const scriptPubKeySize = decimalToCompactHex(output.script.length)
    const scriptPubKey = toHex(output.script)

    hashOutputs = sha256(
      Buffer.from(amount + scriptPubKeySize + scriptPubKey, 'hex')
    )
  }
  console.log(`hashPrevouts: ${toHex(hashPrevouts)} \n`)
  console.log(`hashAmounts: ${toHex(hashAmounts)} \n`)
  console.log(`hashScriptPubKeys: ${toHex(hashScriptPubKeys)} \n`)
  console.log(`hashSequences: ${toHex(hashSequences)} \n`)
  console.log(`hashOutputs: ${toHex(hashOutputs)} \n`)

  const leafHash = null
  const annex = null

  const spendType = Buffer.from(
    ((leafHash ? 2 : 0) + (annex ? 1 : 0)).toString(16).padStart(2, '0'),
    'hex'
  )

  // 6. 拼接
  const version = Buffer.from(
    decimalToFixedByteHex(txTemp.version, 4, true),
    'hex'
  )
  const lockTime = Buffer.from(
    decimalToFixedByteHex(Number(txTemp.locktime), 4, true),
    'hex'
  )

  hashOutputs = (!(isNone || isSingle) && hashOutputs) || EMPTY_BUFFER
  let sigMsg = Buffer.concat([
    version,
    lockTime,
    hashPrevouts,
    hashAmounts,
    hashScriptPubKeys,
    hashSequences,
    hashOutputs,
    spendType
  ])
  let message: {
    [k in string]: Buffer | Uint8Array
  } = {
    sigMsg,
    version,
    lockTime,
    hashPrevouts,
    hashAmounts,
    hashScriptPubKeys,
    hashSequences,
    hashOutputs,
    spendType
  }
  if (isAnyoneCanPay) {
    const input = txTemp.ins[inIndex]

    const inputIndex = Buffer.from(
      decimalToFixedByteHex(input.index, 4, true),
      'hex'
    )

    const utxo = utxos[inIndex]
    const value = Buffer.from(
      decimalToFixedByteHex(Number(utxo.amount), 8, true),
      'hex'
    )

    const scriptPubKeySize = Buffer.from(
      decimalToCompactHex(utxo.script.length / 2),
      'hex'
    )
    const scriptPubKey = Buffer.from(utxo.script, 'hex')
    const sequence = Buffer.from(
      decimalToFixedByteHex(Number(input.sequence), 4, true),
      'hex'
    )

    sigMsg = Buffer.concat([
      sigMsg,
      input.hash,
      inputIndex,
      value,
      scriptPubKeySize,
      scriptPubKey,
      sequence
    ])
    message.inputHash = input.hash
    message.vout = inputIndex
    message.value = value
    message.scriptPubKeySize = scriptPubKeySize
    message.scriptPubKey = scriptPubKey
    message.sequence = sequence
  } else {
    const inIndexBuffer = Buffer.from(
      decimalToFixedByteHex(inIndex, 4, true),
      'hex'
    )
    sigMsg = Buffer.concat([sigMsg, inIndexBuffer])
    message.inIndex = inIndexBuffer
  }
  message.sigMsg = sigMsg

  return message
}
