'use client'

import InteractionCard from '@/components/interaction-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  calculatePublicKeyPoint,
  generatePrivateKey
} from '@/lib/blockchain/keys'
import { COLORS, HOVERBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import RadixViewer from '../radix-viewer'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function PublicKeyGenerator() {
  const [privateKey, setPrivateKey] = useState('')

  const generateRandomPrivateKey = () => {
    setPrivateKey(generatePrivateKey().hexadecimal)
  }
  const getPublicKeyPoint = () => {
    const point = calculatePublicKeyPoint(privateKey)
    setPublicKeyPoint(point)
  }

  useEffect(() => {
    generateRandomPrivateKey()
  }, [])

  const [isErrorPrivateKey, setIsErrorPrivateKey] = useState(false)
  useEffect(() => {
    if (!privateKey) return

    if (privateKey.length !== 64) setIsErrorPrivateKey(true)
    else {
      if (/^[0-9a-fA-F]+$/.test(privateKey)) {
        setIsErrorPrivateKey(false)
        getPublicKeyPoint()
      } else {
        setIsErrorPrivateKey(true)
      }
    }
  }, [privateKey])

  const [isCompressed, setIsCompressed] = useState(true)

  const [publicKeyPoint, setPublicKeyPoint] = useState({
    x: '',
    y: '',
    xHex: '',
    yHex: '',
    uncompressedPublicKey: '',
    compressedPublicKey: ''
  })

  return (
    <InteractionCard
      title='公钥'
      description='从私钥计算公钥'
    >
      <Button
        size='sm'
        onClick={generateRandomPrivateKey}
      >
        随机生成私钥
      </Button>

      <div className='text-sm font-medium mt-4 mb-0.5'>私钥</div>
      <Input
        value={privateKey}
        className={cn(
          'bg-background text-base',
          isErrorPrivateKey && 'bg-red-200'
        )}
        onChange={(e) => setPrivateKey(e.target.value)}
      />

      <div className='text-sm font-medium mt-4 mb-0.5'>公钥坐标</div>

      <div className='flex-col'>
        <div className='flex items-center'>
          <span className='w-6 text-lg font-semibold flex-shrink-0'>X</span>
          <div className='flex-1 overflow-auto'>
            <RadixViewer
              radix={{
                decimal: publicKeyPoint.x,
                hexadecimal: publicKeyPoint.xHex
              }}
              perfer='hexadecimal'
            />
          </div>
        </div>
        <div className='flex items-center mt-2'>
          <span className='w-6 text-lg font-semibold flex-shrink-0'>Y</span>
          <div className='flex-1 overflow-auto'>
            <RadixViewer
              radix={{
                decimal: publicKeyPoint.y,
                hexadecimal: publicKeyPoint.yHex
              }}
              perfer='hexadecimal'
            />
          </div>
        </div>
      </div>

      <RadioGroup
        defaultValue='compressed'
        className='flex mt-4'
        onValueChange={(value) => setIsCompressed(value === 'compressed')}
      >
        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='compressed'
            id='compressed'
          />
          <Label htmlFor='compressed'>压缩公钥</Label>
        </div>
        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='uncompressed'
            id='uncompressed'
          />
          <Label htmlFor='uncompressed'>未压缩公钥</Label>
        </div>
      </RadioGroup>

      <div className='text-sm font-medium mt-4 mb-0.5'>公钥</div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm p-2'>
        {isCompressed ? (
          <span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(COLORS[0], HOVERBGCOLORS[0])}>
                  {publicKeyPoint.compressedPublicKey.slice(0, 2)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>y 坐标的奇偶性: 02表示偶数, 03 表示奇数</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(COLORS[1], HOVERBGCOLORS[1])}>
                  {publicKeyPoint.compressedPublicKey.slice(2)}
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
                <span className={cn(COLORS[0], HOVERBGCOLORS[0])}>
                  {publicKeyPoint.uncompressedPublicKey.slice(0, 2)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>未压缩公钥标识</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(COLORS[1], HOVERBGCOLORS[1])}>
                  {publicKeyPoint.uncompressedPublicKey.slice(2, 66)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>x 坐标</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(COLORS[2], HOVERBGCOLORS[2], 'break-all')}>
                  {publicKeyPoint.uncompressedPublicKey.slice(66)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>y 坐标</span>
              </TooltipContent>
            </Tooltip>
          </span>
        )}
      </div>
    </InteractionCard>
  )
}
