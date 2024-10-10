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
