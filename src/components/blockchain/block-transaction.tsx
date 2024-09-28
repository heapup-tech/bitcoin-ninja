import { rpcClient } from '@/lib/rpc-client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import InteractionCard from '../interaction-card'

export const revalidate = 'force-cache'

export default async function BlockTransaction({ height }: { height: number }) {
  const blockhash = await rpcClient.call('getblockhash', [height])
  const block = await rpcClient.call('getblock', [blockhash, 1])

  return (
    <InteractionCard title={`#${height}`}>
      <ul className='flex flex-col gap-y-2'>
        {block.tx.slice(0, 5).map((txid: string, index: number) => (
          <li
            key={txid}
            className='truncate'
          >
            {index === 0 && <span className='text-blue-500'>Coinbase: </span>}
            <Link
              href={`https://mempool.space/tx/${txid}`}
              target='_blank'
              className={cn(
                'font-medium underline underline-offset-4 text-primary ',
                index === 0 && 'text-blue-500'
              )}
            >
              {txid}
            </Link>
          </li>
        ))}
      </ul>

      <div>···</div>

      <ul className='flex flex-col gap-y-2'>
        {block.tx.slice(-2).map((txid: string) => (
          <li
            key={txid}
            className='truncate'
          >
            <Link
              href={`https://mempool.space/tx/${txid}`}
              target='_blank'
              className='font-medium underline underline-offset-4 text-primary '
            >
              {txid}
            </Link>
          </li>
        ))}
      </ul>

      <div className='mt-4 text-sm font-semibold'>
        共 {block.tx.length} 笔交易
      </div>
    </InteractionCard>
  )
}
