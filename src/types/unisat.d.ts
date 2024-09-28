type UnisatNetwork = 'livenet' | 'testnet'
type UnisatChainEnum =
  | 'BITCOIN_MAINNET'
  | 'BITCOIN_TESTNET'
  | 'BITCOIN_TESTNET4'
  | 'BITCOIN_SIGNET'
  | 'FRACTAL_BITCOIN_MAINNET'
  | 'FRACTAL_BITCOIN_TESTNET'

type UnisatChainUnit = 'BTC' | 'tBTC' | 'sBTC' | 'FB' | 'tFB'

type UnisatSignInput =
  | {
      index: number
      address: string
      sighashTypes?: number[]
      disableTweakSigner?: boolean
    }
  | {
      index: number
      publicKey: string
      sighashTypes?: number[]
      disableTweakSigner?: boolean
    }

type UnisatChain = {
  name: string
  network: UnisatNetwork
  enum: UnisatChainEnum
}
interface Unisat {
  getAccounts(): Promise<string[]>
  requestAccounts(): Promise<string[]>
  getNetwork(): Promise<UnisatNetwork>
  switchNetwork(network: UnisatNetwork): Promise<void>
  getChain(): Promise<UnisatChain>
  switchChain(chain: UnisatChainEnum): Promise<UnisatChain>
  getPublicKey(): Promise<string>
  getBalance(): Promise<{
    confirmed: number
    unconfirmed: number
    total: number
  }>
  getInscriptions(
    cursor?: number,
    size?: number
  ): Promise<{
    total: number
    list: Array<{
      inscriptionId: string
      inscriptionNumber: string
      address: string
      outputValue: number
      content: string
      contentLength: string
      contentType: string
      preview: string
      timestamp: number
      offset: number
      genesisTransaction: string
      location: string
    }>
  }>
  sendBitcoin(
    to: string,
    amount: number,
    options?: { feeRate: number }
  ): Promise<string>
  sendRunes(
    to: string,
    runeid: string,
    amount: string,
    options?: { feeRate: number }
  ): Promise<string>
  sendInscription(
    to: string,
    inscriptionId: string,
    options?: { feeRate: number }
  ): Promise<string>

  inscribeTransfer(ticker: string, amount: string): Promise<void>
  signMessage(
    message: string,
    type?: 'ecdsa' | 'bip322-simple'
  ): Promise<string>
  pushTx({ rawTx: string }): Promise<string>
  signPsbt(
    psbtHex: string,
    options?: {
      autoFinalized: boolean
      toSignInputs: Array<UnisatSignInput>
    }
  ): Promise<string>
  signPsbts(
    psbtHexs: string[],
    options?: Array<{
      autoFinalized: boolean
      toSignInputs: Array<UnisatSignInput>
    }>
  ): Promise<string[]>
  pushPsbt(psbtHex: string): Promise<string>
}
