import { sha256 } from '@noble/hashes/sha2'
import { hexToBytes } from '@noble/hashes/utils'
import { reverseBytes } from './bytes'
import { parserCompactSize } from './compact-size'

export const splitRawTransaction = (hex: string) => {
  let tx: Transaction = {
    version: '',
    inputCount: '',
    inputs: [],
    outputCount: '',
    outputs: [],
    lockTime: ''
  }

  let offset = 0
  const version = hex.slice(offset, 8)
  offset += 8
  tx.version = version

  let marker = hex.slice(offset, offset + 2)
  offset += 2

  let flag = hex.slice(offset, offset + 2)
  offset += 2

  let isWitness = false
  if (marker === '00' && flag === '01') {
    isWitness = true
    tx.marker = marker
    tx.flag = flag
  } else {
    offset -= 4
  }

  const inputCountCompact = parserCompactSize(hex, offset)

  tx.inputCount = inputCountCompact.section
  offset = inputCountCompact.offset

  for (let i = 0; i < inputCountCompact.numberValue; i++) {
    const txid = hex.slice(offset, offset + 64)
    offset += 64

    const vout = hex.slice(offset, offset + 8)
    offset += 8

    const scriptSigSizeCompact = parserCompactSize(hex, offset)
    offset = scriptSigSizeCompact.offset

    const scriptSigSize = scriptSigSizeCompact.section

    const scriptSig = hex.slice(
      offset,
      offset + scriptSigSizeCompact.numberValue * 2
    )
    offset += scriptSigSizeCompact.numberValue * 2

    const sequence = hex.slice(offset, offset + 8)
    offset += 8

    tx.inputs.push({
      txid,
      vout,
      scriptSigSize,
      scriptSig,
      sequence
    })
  }

  const outputCountCompact = parserCompactSize(hex, offset)
  tx.outputCount = outputCountCompact.section
  offset = outputCountCompact.offset

  for (let i = 0; i < outputCountCompact.numberValue; i++) {
    const amount = hex.slice(offset, offset + 16)
    offset += 16

    const scriptPubKeySizeCompact = parserCompactSize(hex, offset)
    offset = scriptPubKeySizeCompact.offset

    const scriptPubKeySize = scriptPubKeySizeCompact.section

    const scriptPubKey = hex.slice(
      offset,
      offset + scriptPubKeySizeCompact.numberValue * 2
    )
    offset += scriptPubKeySizeCompact.numberValue * 2

    tx.outputs.push({
      amount,
      scriptPubKeySize,
      scriptPubKey
    })
  }

  if (isWitness) {
    tx.witness = []
    for (let i = 0; i < inputCountCompact.numberValue; i++) {
      const stackItemsCompact = parserCompactSize(hex, offset)
      offset = stackItemsCompact.offset

      const stackItems = stackItemsCompact.section

      let items: {
        [key: string]: {
          size: string
          item: string
        }
      } = {}

      for (let j = 0; j < stackItemsCompact.numberValue; j++) {
        const sizeCompact = parserCompactSize(hex, offset)
        offset = sizeCompact.offset

        const item = hex.slice(offset, offset + sizeCompact.numberValue * 2)
        offset += sizeCompact.numberValue * 2
        items[String(j)] = {
          size: sizeCompact.section,
          item
        }
      }
      tx.witness.push({
        stackItems,
        ...items
      } as Witness)
    }
  }

  tx.lockTime = hex.slice(offset, offset + 8)
  offset += 8

  // if (offset !== hex.length) {
  //   throw new Error(
  //     'Transaction parsing error: offset does not match hex length'
  //   )
  // }

  return tx
}

const TxOrderKeys: TransactionKey[] = [
  'version',
  'marker',
  'flag',
  'inputCount',
  'inputs',
  'outputCount',
  'outputs',
  'witness',
  'lockTime'
]
// 分割后交易转 JSON 字符串
// TODO: 根据 TxOrderKeys 排序
export const stringifySplitedTransaction = (tx: Transaction): string => {
  return JSON.stringify(tx, null, 2)
}

// 从原始交易数据中提取用于计算交易ID的数据
export const extractDataForTxid = (tx: Transaction) => {
  let rawTx = `${tx.version}${tx.inputCount}`

  tx.inputs.forEach((input) => {
    rawTx += `${input.txid}${input.vout}${input.scriptSigSize}${input.scriptSig}${input.sequence}`
  })
  rawTx += `${tx.outputCount}`
  tx.outputs.forEach((output) => {
    rawTx += `${output.amount}${output.scriptPubKeySize}${output.scriptPubKey}`
  })
  rawTx += `${tx.lockTime}`

  return rawTx
}

export const calculateTxid = (rawTx: string) => {
  const hashedTxid = sha256(sha256(hexToBytes(rawTx)))

  const naturalTxid = Buffer.from(hashedTxid).toString('hex')
  const reversedTxid = Buffer.from(reverseBytes(hashedTxid)).toString('hex')

  return { naturalTxid, reversedTxid }
}
