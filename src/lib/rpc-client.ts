const createIdGenerator = () => {
  let currentId = 0
  return () => ++currentId
}

const generateId = createIdGenerator()

export const rpcClient = {
  async call(method: string, params: any = [], init?: NextFetchRequestConfig) {
    const response = await this.request(method, params, init).then((res) => {
      return res.json()
    })

    if (response.error) {
      throw new Error('RPC Error: ' + response.error.message)
    }
    return response.result
  },

  request(method: string, params: any, init?: NextFetchRequestConfig) {
    return fetch(process.env.BITCOIN_RPC_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: generateId(),
        method,
        params
      }),
      ...init
    })
  }
}
