// https://docs.unisat.io/dev/unisat-developer-center/unisat-wallet

export default class UnisatWallet {
  hasInstalled() {
    return window.unisat !== undefined
  }

  getTarget(): Unisat {
    if (!this.hasInstalled()) throw new Error('Unisat not installed')
    return window.unisat
  }

  async connect() {
    let addresses: string[] = await this.getTarget().getAccounts()

    if (!addresses || addresses.length === 0) {
      return this.getTarget().requestAccounts()
    }

    return addresses
  }

  async autoConnect() {
    return this.getTarget().getAccounts()
  }

  async getNetwork() {
    return this.getTarget().getNetwork()
  }
}
