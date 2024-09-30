'use client'

import { generateSeed } from '@/lib/blockchain/keys'
import { GETCOLORS, GETHOVERBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { isHexadecimal } from '@/lib/validator'
import { hmac } from '@noble/hashes/hmac'
import { sha512 } from '@noble/hashes/sha512'
import { useEffect, useState } from 'react'
import { toHex } from 'uint8array-tools'
import InteractionCard from '../interaction-card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function ExtendedKey() {
  const [seed, setSeed] = useState(
    '333da71c53ae1a77e2afd6d2f4d45a65ef67a640d9fb92fa96c6fee18599bbfaaab41ad02397dba5ce1d94a626b313747fa3e0f516ca16b225e105050909f134'
  )
  const [isErrorSeed, setIsErrorSeed] = useState(false)
  const [extendedKey, setExtendedKey] = useState('')

  const generateRandomSeeed = () => {
    const { hexadecimal } = generateSeed()
    setSeed(hexadecimal)
  }

  useEffect(() => {
    if (!seed) return
    if (!isHexadecimal(seed)) {
      setIsErrorSeed(true)
    } else {
      setIsErrorSeed(false)

      calcExtendedKey()
    }
  }, [seed])

  const calcExtendedKey = () => {
    const res = hmac(sha512, 'Bitcoin seed', Buffer.from(seed, 'hex'))

    setExtendedKey(toHex(res))
  }
  return (
    <InteractionCard title='拓展秘钥'>
      <Button
        size='sm'
        onClick={generateRandomSeeed}
      >
        生成随机Seed
      </Button>

      <div className='text-sm font-medium mt-4 mb-0.5'>Seed</div>
      <Textarea
        value={seed}
        className={cn('bg-background text-base', isErrorSeed && 'bg-red-200')}
        onChange={(e) => setSeed(e.target.value)}
      />

      <div className='text-sm font-medium mt-4 mb-0.5'>拓展秘钥</div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(GETCOLORS(0), GETHOVERBGCOLORS(0))}>
              {extendedKey.slice(0, 64)}
            </span>
          </TooltipTrigger>
          <TooltipContent>主私钥</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}>
              {extendedKey.slice(64)}
            </span>
          </TooltipTrigger>
          <TooltipContent>链码</TooltipContent>
        </Tooltip>
      </div>
    </InteractionCard>
  )
}
