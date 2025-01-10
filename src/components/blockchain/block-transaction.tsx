import { rpcClient } from '@/lib/rpc-client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import InteractionCard from '../interaction-card'

export const revalidate = 'force-cache'

export default async function BlockTransaction({ height }: { height: number }) {
  const blockhash = await rpcClient.call('getblockhash', [height])

  console.log('blockhash', blockhash)

  // const block = await rpcClient.call('getblock', [blockhash, 1])

  const block = {
    tx: [
      '9370d2c59b890fedd7a507124cabd44854df6f3e7bf0d59c2a69310d04adb2b8',
      '18c39b6e00152f58f64b24c7c1b139170b43e46175650aef93ae4efef8265a3b',
      '0ed1e553c7d65d9c0afd6155ea491a8db1220e569b401fd561a80e5a992e4a6b',
      '999548c568a643fa75a11b823ed5d3aa44226725d1d7b7befdcb7fd1ad190554',
      'c922d45822312bad62d379c064a6d58113bb4b792dc5a9458033b8e3777a1955',
      'b1de88a8529d4922e3905d31fd0a49d95485cd1df5a335531b79cb686386c45e',
      'c6cf12abd67b949c16ae24be627494707e0ded2a532676121480cf992fe92a71'
    ]
  }

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
