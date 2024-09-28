'use server'

import { rpcClient } from '@/lib/rpc-client'

export const getRawTransaction = async ({ txid }: { txid: string }) => {
  const rawTx = await rpcClient.call('getrawtransaction', [txid])

  return rawTx
}
