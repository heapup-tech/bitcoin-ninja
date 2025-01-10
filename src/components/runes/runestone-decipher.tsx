'use client'

import RuneStone from '@/lib/blockchain/rune/runestone'
import { isHexadecimal } from '@/lib/validator'
import { getRawTransaction } from '@/server-actions/raw-transaction'
import { useQuery } from '@tanstack/react-query'
import { Transaction } from 'bitcoinjs-lib/src/transaction'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import CodeBlock from '../code-block'
import InteractionCard from '../interaction-card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export default function RunestoneDecipher() {
  const [txid, setTxid] = useState(
    '621d1f47f6624946d208437477e2f575087dba5172371114f0c8087788efe46f'
  )
  const [tx, setTx] = useState('')
  const [runestone, setRunestone] = useState<RuneStone>()
  const [error, setError] = useState<string>()

  const {
    isFetching: queryTxLoading,
    data: rawTx,
    refetch: queryTransaction
  } = useQuery({
    queryKey: ['raw-transaction', { txid }],
    queryFn: async () => {
      if (!txid) return ''
      const rawTx = await getRawTransaction({ txid })
      return rawTx
    },
    enabled: isHexadecimal(txid || '', 64),
    staleTime: Infinity
  })

  useEffect(() => {
    setTx(rawTx)
  }, [rawTx])

  useEffect(() => {
    if (!tx) return
    try {
      let runestone = new RuneStone()
      const t = Transaction.fromHex(tx)
      runestone.decipher(t)

      setRunestone(runestone)
      setError('')
    } catch (error) {
      setError('解析失败')
    }
  }, [tx])

  const replacer = (key: any, value: any) => {
    // 处理 BigInt 类型
    if (typeof value === 'bigint') {
      return value.toString()
    }
    return value
  }
  return (
    <InteractionCard title='交易解密'>
      <div className='flex items-center space-x-2 mt-4'>
        <Input
          placeholder='请输入交易 ID'
          value={txid}
          disabled={queryTxLoading}
          onChange={(e) => setTxid(e.target.value)}
          className='bg-background text-base'
        />
        <Button
          size='sm'
          onClick={() => queryTransaction()}
          disabled={queryTxLoading}
        >
          查询交易
          {queryTxLoading && <Loader className='ml-2 h-4 w-4 animate-spin' />}
        </Button>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>原始交易数据</div>
      <Textarea
        placeholder='查询交易ID 或 手动输入交易数据'
        rows={8}
        defaultValue={tx}
        className='bg-background text-base'
        disabled={queryTxLoading}
        onChange={(e) => setTx(e.target.value)}
      />

      <div className='text-sm font-medium mt-4 mb-0.5'>Runestone</div>

      {error ? (
        <div className='text-destructive'>解析失败</div>
      ) : (
        <CodeBlock
          code={(runestone && JSON.stringify(runestone, replacer, 2)) || '...'}
          language='json'
        />
      )}
    </InteractionCard>
  )
}
