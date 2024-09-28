import { rpcClient } from '@/lib/rpc-client'

export default async function BitcoinChainTips() {
  const x = await rpcClient.call('getchaintips')
  return <div></div>
}
