'use client'

import InteractionCard from '@/components/interaction-card'
import { Button } from '@/components/ui/button'
import { generatePrivateKey } from '@/lib/blockchain/keys'
import { ADDRESS_BASE58_PREFIX, COLORS, WIF_PREFIX } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { sha256 } from 'bitcoinjs-lib/src/crypto'
import base58 from 'bs58'
import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function WIFPrivateKeyGenerator() {
  const [privateKey, setPrivateKey] = useState('')
  const [versionedPrivateKey, setVersionedPrivateKey] = useState('')
  const [versionedCompressedPrivateKey, setVersionedCompressedPrivateKey] =
    useState('')
  const [checksumPrivateKey, setChecksumPrivateKey] = useState('')

  const [isCompressed, setIsCompressed] = useState(true)

  const [wifPrivateKey, setWifPrivateKey] = useState('')
  const [isErrorPrivateKey, setIsErrorPrivateKey] = useState(false)

  const [network, setNetwork] =
    useState<keyof typeof ADDRESS_BASE58_PREFIX>('mainnet')

  useEffect(() => {
    generateRandomPrivateKey()
  }, [])

  const generateRandomPrivateKey = () => {
    setPrivateKey(generatePrivateKey().hexadecimal)
  }

  useEffect(() => {
    if (!privateKey) return
    if (privateKey.length !== 64 || !/^[0-9a-fA-F]+$/.test(privateKey)) {
      setIsErrorPrivateKey(true)
      return
    }
    setIsErrorPrivateKey(false)
    calculateWIFPrivateKey()
  }, [privateKey])

  const calculateWIFPrivateKey = () => {
    const privateKeyBuffer = Buffer.from(privateKey, 'hex')

    const prefix = WIF_PREFIX[network]
    const versionedPrivateKey = Buffer.concat([
      Buffer.from([prefix]),
      privateKeyBuffer
    ])
    setVersionedPrivateKey(versionedPrivateKey.toString('hex'))

    let versionedCompressedPrivateKey: Buffer = Buffer.alloc(0)
    if (isCompressed) {
      versionedCompressedPrivateKey = Buffer.concat([
        versionedPrivateKey,
        Buffer.from([0x01])
      ])
    } else {
      versionedCompressedPrivateKey = Buffer.concat([versionedPrivateKey])
    }
    setVersionedCompressedPrivateKey(
      versionedCompressedPrivateKey.toString('hex')
    )

    const checksum = sha256(sha256(versionedCompressedPrivateKey)).subarray(
      0,
      4
    )

    const checksumPrivateKey = Buffer.concat([
      versionedCompressedPrivateKey,
      checksum
    ])
    setChecksumPrivateKey(checksumPrivateKey.toString('hex'))

    const wifPrivateKey = base58.encode(checksumPrivateKey)
    setWifPrivateKey(wifPrivateKey)
  }

  useEffect(() => {
    if (!privateKey) return
    calculateWIFPrivateKey()
  }, [network, isCompressed])

  return (
    <InteractionCard
      title='WIF私钥生成器'
      description='从原始私钥生成钱包导入格式的私钥'
    >
      <Button
        size='sm'
        onClick={generateRandomPrivateKey}
      >
        随机生成私钥
      </Button>

      <div className='text-sm font-medium mt-4 mb-0.5'>原始私钥</div>
      <Input
        value={privateKey}
        className={cn(
          'bg-background text-base',
          isErrorPrivateKey && 'bg-red-200'
        )}
        onChange={(e) => setPrivateKey(e.target.value)}
      />

      <RadioGroup
        className='flex mt-4'
        value={network}
        onValueChange={(v: keyof typeof ADDRESS_BASE58_PREFIX) => setNetwork(v)}
      >
        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='mainnet'
            id='wif_mainnet'
          />
          <Label htmlFor='wif_mainnet'>主网</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='testnet'
            id='wif_testnet'
          />
          <Label htmlFor='wif_testnet'>测试网</Label>
        </div>
      </RadioGroup>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 1: 添加版本前缀
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-sm'>
              版本前缀:
              <ul>
                <li>主网: 0x80</li>
                <li>测试网: 0xef</li>
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`${COLORS[0]}`}>
              {versionedPrivateKey.slice(0, 2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>版本前缀</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`${COLORS[1]}`}>
              {versionedPrivateKey.slice(2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>私钥</span>
          </TooltipContent>
        </Tooltip>
      </div>

      <RadioGroup
        className='flex mt-4'
        defaultValue='compressed'
        onValueChange={(value) => setIsCompressed(value === 'compressed')}
      >
        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='compressed'
            id='wif_compressed'
          />
          <Label htmlFor='wif_compressed'>压缩</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='uncompressed'
            id='wif_uncompressed'
          />
          <Label htmlFor='wif_uncompressed'>未压缩</Label>
        </div>
      </RadioGroup>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 2: 添加是否压缩标志
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div>压缩标志表示该私钥生成的公钥是压缩公钥还是未压缩公钥</div>
            <div className='mt-2'>添加 0x01 表示生成的是压缩公钥</div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`${COLORS[0]}`}>
              {versionedCompressedPrivateKey.slice(0, 2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>版本前缀</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`${COLORS[1]}`}>
              {versionedCompressedPrivateKey.slice(2, 66)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>私钥</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`${COLORS[2]}`}>
              {versionedCompressedPrivateKey.slice(66)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>压缩标志</span>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 3: 计算校验和
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-sm'>
              对上一步结果执行双重 Sha256 后取前 4 个字节作为校验和,
              并添加到字符串
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`${COLORS[0]}`}>
              {checksumPrivateKey.slice(0, 2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>版本前缀</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`${COLORS[1]}`}>
              {checksumPrivateKey.slice(2, 66)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>私钥</span>
          </TooltipContent>
        </Tooltip>

        {isCompressed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={`${COLORS[2]}`}>
                {checksumPrivateKey.slice(66, 68)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>压缩标志</span>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`${COLORS[3]} `}>
              {checksumPrivateKey.slice(isCompressed ? 68 : 66)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>校验和</span>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 4: Base58 编码
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <span>Base58 编码后的结果即为 WIF 私钥</span>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5'>
        <span className={`${COLORS[4]}`}>{wifPrivateKey}</span>
      </div>
    </InteractionCard>
  )
}
