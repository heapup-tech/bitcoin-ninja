'use client'

import { cn } from '@/lib/utils'
import { isHexadecimal } from '@/lib/validator'
import { hash256 } from 'bitcoinjs-lib/src/crypto'
import { useEffect, useState } from 'react'
import InteractionCard from '../interaction-card'
import { Textarea } from '../ui/textarea'

export default function Hash256Calculator({
  minLength = 0,
  defaultValue = ''
}: {
  minLength?: number
  defaultValue?: string
}) {
  const [hex, setHex] = useState(defaultValue)
  const [isErrorHex, setIsErrorHex] = useState(false)

  const [hash, setHash] = useState('')

  useEffect(() => {
    if (!hex) return
    if (!isHexadecimal(hex, minLength)) {
      setIsErrorHex(true)
      return
    }
    setIsErrorHex(false)

    calculateHash256()
  }, [hex])

  const calculateHash256 = () => {
    setHash(hash256(Buffer.from(hex, 'hex')).toString('hex'))
  }
  return (
    <InteractionCard
      title='Hash256 计算器'
      description='对给定的数据进行双重sha256 计算'
    >
      <div className='text-sm font-medium mt-4 mb-0.5'>16进制数据</div>
      <Textarea
        value={hex}
        className={cn('bg-background text-base', isErrorHex && 'bg-red-200')}
        onChange={(e) => setHex(e.target.value)}
      />

      <div className='text-sm font-medium mt-4 mb-0.5'>结果</div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-8'>
        {hash}
      </div>
    </InteractionCard>
  )
}
