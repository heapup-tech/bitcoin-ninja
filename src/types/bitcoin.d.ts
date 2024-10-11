type TransactionInput = {
  txid: string
  vout: string
  scriptSigSize: string // compact size
  scriptSig: string
  sequence: string
}

type TransactionOutput = {
  amount: string
  scriptPubKeySize: string // compact size
  scriptPubKey: string
}
type Witness = {
  stackItems: string
} & {
  [key: string]: {
    size: string
    item: string
  }
}

interface Transaction {
  version: string
  marker?: string
  flag?: string
  inputCount: string // compact size
  inputs: TransactionInput[]
  outputCount: string // compact size
  outputs: TransactionOutput[]
  witness?: Array<Witness>
  lockTime: string
}

type TransactionKey = keyof Transaction

type ScriptType =
  | 'p2pk'
  | 'p2pkh'
  | 'p2ms'
  | 'p2sh'
  | 'p2wpkh'
  | 'p2wsh'
  | 'p2tr'

type UTXO = {
  script: string
  amount: string
  type: Uppercase<ScriptType | 'unknown'>
}

type WitnessV0Message = {
  sigMsg: string
  version: string
  hashPrevouts: string
  hashSequence: string
  inputHash: string
  vout: string
  prevOutSize: string
  prevOut: string
  amount: string
  sequence: string
  hashOutputs: string
  lockTime: string
}

type WitnessV1Message = {
  sigMsg: string
  version: string
  lockTime: string
  hashPrevouts: string
  hashAmounts: string
  hashScriptPubKeys: string
  hashSequences: string
  hashOutputs?: string
  spendType: string
  inputHash?: string
  vout?: string
  value?: string
  scriptPubKeySize?: string
  scriptPubKey?: string
  sequence?: string
  inIndex?: string
}
