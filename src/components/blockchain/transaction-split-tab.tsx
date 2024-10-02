import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  splitRawTransaction,
  stringifySplitedTransaction
} from '@/lib/blockchain/transaction'
import Link from 'next/link'
import CodeBlock from '../code-block'
import TransactionHex from './transaction-hex'

export default function TransactionSplitTab({
  txid,
  hex
}: {
  txid?: string
  hex?: string
}) {
  let rawTx = hex || ''

  let decodedTx
  try {
    decodedTx = splitRawTransaction(rawTx)
  } catch (error) {}

  return (
    <div className='mt-4 '>
      <Tabs defaultValue='raw'>
        <TabsList className=''>
          <TabsTrigger value='raw'>Raw</TabsTrigger>
          <TabsTrigger value='split'>Split</TabsTrigger>
        </TabsList>

        <TabsContent value='raw'>
          {decodedTx ? <TransactionHex hex={rawTx} /> : <div>无效交易</div>}
        </TabsContent>

        <TabsContent value='split'>
          {decodedTx ? (
            <CodeBlock
              language='json'
              code={stringifySplitedTransaction(decodedTx)}
            />
          ) : (
            <div>无效交易</div>
          )}
        </TabsContent>
      </Tabs>
      {txid && (
        <div className='text-xs mt-1'>
          交易ID:{' '}
          <Link
            href={`https://mempool.space/tx/${txid}`}
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
