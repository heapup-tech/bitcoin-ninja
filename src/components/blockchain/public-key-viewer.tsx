'use client'

import { GETCOLORS, GETHOVERBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface PublicKeyViewerProps {
  publicKey: string // compressedPublicKey or uncompressedPublicKey
}

export default function PublicKeyViewer({ publicKey }: PublicKeyViewerProps) {
  const [isCompressed, setIsCompressed] = useState(true)
  useEffect(() => {
    if (publicKey) {
      if (publicKey.length === 66) setIsCompressed(false)
      else setIsCompressed(false)
    }
  }, [publicKey])
  return (
    <div className='bg-background text-base break-all border rounded-md shadow-sm p-2'>
      {isCompressed ? (
        <span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(GETCOLORS(0), GETHOVERBGCOLORS(0))}>
                {publicKey.slice(0, 2)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>y 坐标的奇偶性: 02表示偶数, 03 表示奇数</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}>
                {publicKey.slice(2)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>x 坐标</span>
            </TooltipContent>
          </Tooltip>
        </span>
      ) : (
        <span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(GETCOLORS(0), GETHOVERBGCOLORS(0))}>
                {publicKey.slice(0, 2)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>未压缩公钥标识</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}>
                {publicKey.slice(2, 66)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>x 坐标</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(GETCOLORS(2), GETHOVERBGCOLORS(2), 'break-all')}
              >
                {publicKey.slice(66)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>y 坐标</span>
            </TooltipContent>
          </Tooltip>
        </span>
      )}
    </div>
  )
}
