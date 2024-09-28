'use client'

import { getRawTransaction } from '@/server-actions/raw-transaction'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import InteractionCard from '../interaction-card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import TransactionSplitTab from './transaction-split-tab'

export default function TransactionSpliter() {
  const [queriedTxid, setQueriedTxid] = useState('')

  const [queryTxid, setQueryTxid] = useState(
    '15ea1582e95d5dd8d352f8f9e90b4d32855c6aa56b1d61c8ea73f257b2ef6d47'
  )
  const [queryTxLoading, setQueryTxLoading] = useState(false)

  const [rawTx, setRawTx] = useState('')

  const queryTransaction = async () => {
    setQueryTxLoading(true)

    if (!queryTxid) {
      setQueryTxLoading(false)
      return toast.error('请输入交易 ID')
    }

    try {
      const rawTx = await getRawTransaction({ txid: queryTxid })

      setQueryTxLoading(false)

      setRawTx(rawTx)
      setQueriedTxid(queryTxid)
    } catch (error) {
      setQueryTxLoading(false)

      toast.error('获取交易失败')
    }
  }

  return (
    <InteractionCard
      title='交易数据拆分'
      description='将原始交易数据拆分为单独的字段'
    >
      <div className='flex items-center space-x-2 mt-4'>
        <Input
          placeholder='请输入交易 ID'
          value={queryTxid}
          disabled={queryTxLoading}
          onChange={(e) => setQueryTxid(e.target.value)}
          className='bg-background'
        />
        <Button
          size='sm'
          onClick={queryTransaction}
          disabled={queryTxLoading}
        >
          查询交易
          {queryTxLoading && <Loader className='ml-2 h-4 w-4 animate-spin' />}
        </Button>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>原始交易数据</div>
      <Textarea
        placeholder='点击查询交易以显示交易数据'
        readOnly
        rows={8}
        defaultValue={rawTx}
        className='bg-background text-lg font-semibold'
      />
      {queriedTxid && (
        <div className='text-xs mt-1'>
          交易ID:{' '}
          <Link
            href={`https://mempool.space/tx/${queriedTxid}`}
            target='_blank'
            className='underline text-primary'
          >
            {queriedTxid}
          </Link>
        </div>
      )}

      {rawTx && <TransactionSplitTab hex={rawTx} />}
    </InteractionCard>
  )
}
