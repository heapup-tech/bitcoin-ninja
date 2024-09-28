'use client'

import { generatePrivateKey } from '@/lib/blockchain/keys'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import InteractionCard from '../interaction-card'
import RadixViewer from '../radix-viewer'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

export default function PrivateKeyGenerator() {
  const [bits, setBits] = useState<Array<0 | 1>>([])

  const generateRandomBits = () => {
    setBits(generatePrivateKey().bits)
  }

  useEffect(() => {
    generateRandomBits()
  }, [])

  const reverseBit = (index: number) => {
    const newBits = [...bits]
    newBits[index] = newBits[index] === 1 ? 0 : 1
    setBits(newBits)
  }

  const [decimal, setDecimal] = useState('')
  const [hexadecimal, setHexadecimal] = useState('')

  useEffect(() => {
    if (!bits || bits.length !== 256) return

    const bigDecimalInt = BigInt(`0b${bits.join('')}`)
    setDecimal(bigDecimalInt.toString())
    setHexadecimal(bigDecimalInt.toString(16).padEnd(64, '0'))
  }, [bits])

  return (
    <InteractionCard
      title='私钥'
      description='随机生成256个比特位'
    >
      <Button
        size='sm'
        onClick={generateRandomBits}
      >
        随机生成
      </Button>
      <div className='grid grid-cols-auto-fill-40 grid-flow-row-dense mt-4 select-none'>
        {bits.map((bit, index) => (
          <div
            key={index}
            className={cn(
              'aspect-square flex justify-center items-center border  bg-background hover:cursor-pointer',
              bit === 1 && 'bg-primary text-white'
            )}
            onClick={() => reverseBit(index)}
          >
            {bit}
          </div>
        ))}
      </div>
      <div className='text-sm font-medium mt-4 mb-0.5'>二进制</div>
      <div className='flex border rounded-md shadow-sm overflow-hidden items-stretch'>
        <div className='min-h-9 flex items-center p-2 w-14 justify-center border-r bg-muted flex-shrink-0'>
          0b
        </div>

        <Textarea
          readOnly
          rows={3}
          defaultValue={bits.join('')}
          className='bg-background text-base border-none shadow-none rounded-none focus:ring-0 focus-visible:ring-0 flex-1'
        />
      </div>
      <div className='text-sm font-medium mt-4 mb-0.5'>十进制</div>
      <RadixViewer
        radix={{
          decimal
        }}
      />
      <div className='text-sm font-medium mt-4 mb-0.5'>十六进制(私钥)</div>
      <RadixViewer
        radix={{
          hexadecimal
        }}
      />
    </InteractionCard>
  )
}
