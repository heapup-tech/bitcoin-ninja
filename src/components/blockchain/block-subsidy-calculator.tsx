'use client'

import InteractionCard from '@/components/interaction-card'
import { subsidy } from '@/lib/blockchain/block'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { numericFormatter } from 'react-number-format'
import { Input } from '../ui/input'

export default function BlockSubsidyCalculator() {
  const [blockHeight, setBlockHeight] = useState('0')
  const [blockSubsidy, setBlockSubsidy] = useState(0n)

  useEffect(() => {
    if (!blockHeight) return setBlockSubsidy(0n)
    setBlockSubsidy(subsidy(Number(blockHeight)))
  }, [blockHeight])

  // ${numericFormatter(blockSubsidy / BigInt('100000000').toString(), { decimalScale: 8 })} btc
  return (
    <InteractionCard
      title='区块补贴'
      description='每4年减半'
    >
      <div className='text-sm font-medium mt-4 mb-0.5'>区块高度</div>
      <Input
        className='bg-background'
        value={blockHeight}
        onChange={(e) => {
          let v = e.target.value
          v = v.replace(/[^\d]/g, '')
          setBlockHeight(v)
        }}
      ></Input>

      <div className='text-sm font-medium mt-4 mb-0.5 flex'>
        区块补贴:{' '}
        {`${blockSubsidy} sats = ${numericFormatter(
          BigNumber(blockSubsidy.toString()).dividedBy(100000000).toFixed(8),
          {
            decimalScale: 8
          }
        )} btc`}
      </div>
    </InteractionCard>
  )
}
