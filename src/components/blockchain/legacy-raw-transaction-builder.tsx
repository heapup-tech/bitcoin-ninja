'use client'

import { CirclePlus } from 'lucide-react'
import { useState } from 'react'
import InteractionCard from '../interaction-card'
import { Input } from '../ui/input'

export default function LegacyRawTransactionBuilder() {
  const [inputs, setInputs] = useState<TransactionInput[]>([])
  const [outputs, setOutputs] = useState<TransactionOutput[]>([])
  const [fee, setFee] = useState('0')
  const [rawTransaction, setRawTransaction] = useState('')
  const [isError, setIsError] = useState(false)
  const [isErrorRawTransaction, setIsErrorRawTransaction] = useState(false)

  return (
    <InteractionCard title='Legacy 交易构造器'>
      <div className='text-sm font-medium mt-4 mb-0.5'>构造交易数据</div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm p-2 flex flex-col gap-2'>
        <div className='flex items-center'>
          <div className='w-20'>Version</div>
          <div className='bg-background text-base break-all border rounded-md shadow-sm p-1 flex-1'>
            01000000
          </div>
        </div>

        <div className='flex items-center'>
          <div className='w-20'>交易输入</div>
          <div className='bg-background text-base break-all border rounded-md shadow-sm p-1 flex-1 flex flex-col gap-2'>
            <div className='flex items-center'>
              <div className='w-28'>交易哈希</div>
              <Input />
            </div>
            <div className='flex items-center'>
              <div className='w-28'>输出索引</div>
              <Input />
            </div>

            <div className='flex items-center'>
              <div className='w-28'>Sequence</div>
              <Input />
            </div>
          </div>
        </div>

        <div className='flex items-center'>
          <div className='w-24 flex items-center gap-x-2'>
            <span>交易输出</span>
            <CirclePlus className='w-5 h-5 hover:cursor-pointer' />
          </div>
          <div className='bg-background text-base break-all border rounded-md shadow-sm p-1 flex-1 flex flex-col gap-2 min-h-9'>
            <div className='flex items-center'>
              <div className='w-28'>金额</div>
              <Input />
            </div>
            <div className='flex items-center'>
              <div className='w-28'>脚本公钥</div>
              <Input />
            </div>
          </div>
        </div>

        <div className='flex items-center'>
          <div className='w-20'>Locktime</div>
          <Input className='flex-1' />
        </div>
      </div>
    </InteractionCard>
  )
}
