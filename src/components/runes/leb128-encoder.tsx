'use client'
import varint from '@/lib/blockchain/rune/varint'
import { useEffect, useState } from 'react'
import ContentCard from '../content-card'
import InteractionCard from '../interaction-card'
import { Input } from '../ui/input'

export default function LEB128Encoder({ initValue }: { initValue: bigint }) {
  const [value, setValue] = useState<bigint>(initValue || 8256n)
  const [encodedValue, setEncodedValue] = useState<number[]>([])

  useEffect(() => {
    setEncodedValue(varint.encode(value))
  }, [value])
  return (
    <InteractionCard title='LEB128 编码'>
      <ContentCard title='原始值(十进制)'>
        <Input
          onChange={(e) => setValue(BigInt(e.target.value))}
          value={value.toString()}
          className='bg-white'
          type='number'
        />
      </ContentCard>

      <ContentCard
        title='编码结果(十进制)'
        content={encodedValue.join(' ')}
      />

      <ContentCard
        title='编码结果(十六进制)'
        content={encodedValue.map((v) => v.toString(16)).join(' ')}
      />
    </InteractionCard>
  )
}
