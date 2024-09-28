'use server'

import { rpcClient } from '@/lib/rpc-client'

export const getNetworkHashps = async () => {
  const networkHashps = await rpcClient.call('getnetworkhashps')

  return networkHashps
}
