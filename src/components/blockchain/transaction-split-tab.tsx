import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  splitRawTransaction,
  stringifySplitedTransaction
} from '@/lib/blockchain/transaction'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import dynamic from 'next/dynamic'
import TransactionHex from './transaction-hex'

const CodeBlock = dynamic(() => import('@/components/code-block'), {
  ssr: false
})

export default function TransactionSplitTab({
  txid,
  hex,
  isTestnet = false,
  className = ''
}: {
  txid?: string
  hex?: string
  isTestnet?: boolean
  className?: string
}) {
  let rawTx = hex || ''

  if (!rawTx) return null

  let decodedTx
  try {
    decodedTx = splitRawTransaction(rawTx)
  } catch (error) {}

  return (
    <div className={cn('mt-4', className)}>
      <Tabs defaultValue='raw'>
        <TabsList>
          <TabsTrigger value='raw'>Raw</TabsTrigger>
          <TabsTrigger value='split'>Split</TabsTrigger>
        </TabsList>

        <TabsContent value='raw'>
          {decodedTx ? (
            <TransactionHex hex={rawTx} />
          ) : (
            <div className='border rounded-lg px-3 py-2 font-semibold break-all whitespace-pre-wrap text-base bg-background text-destructive'>
              无效交易
            </div>
          )}
        </TabsContent>

        <TabsContent value='split'>
          {decodedTx ? (
            <CodeBlock
              language='json'
              code={stringifySplitedTransaction(decodedTx)}
            />
          ) : (
            <div className='border rounded-lg px-3 py-2 font-semibold break-all whitespace-pre-wrap text-base bg-background text-destructive'>
              无效交易
            </div>
          )}
        </TabsContent>
      </Tabs>
      {txid && (
        <div className='text-xs mt-1'>
          交易ID:{' '}
          <Link
            href={`https://mempool.space${isTestnet ? '/testnet' : ''}/tx/${txid}`}
            target='_blank'
            className='underline text-primary'
          >
            {txid}
          </Link>
        </div>
      )}
    </div>
  )
}
