'use client'

import InteractionCard from '@/components/interaction-card'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  calculatePublicKeyPoint,
  generatePrivateKey
} from '@/lib/blockchain/keys'
import { tweakKey } from '@/lib/blockchain/taproot'
import { ADDRESS_BECH32_PREFIX, COLORS, HOVERBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { isCompressedPublicKey, isValidPrivateKey } from '@/lib/validator'
import { bech32m } from 'bech32'
import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toHex } from 'uint8array-tools'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

export default function TaprootAddressGenerator() {
  const [privateKey, setPrivateKey] = useState('')
  const [isErrorPublicKey, setIsErrorPublicKey] = useState(false)
  const [isErrorPrivateKey, setIsErrorPrivateKey] = useState(false)
  const [publicKey, setPublicKey] = useState('')
  const [publicKeyX, setPublicKeyX] = useState('')
  const [tPubKey, setTPubKey] = useState('')

  const [bech32Words, setBech32Words] = useState('')
  const [versionedWords, setVersionedWords] = useState('')

  const [address, setAddress] = useState('')

  const [network, setNetwork] =
    useState<keyof typeof ADDRESS_BECH32_PREFIX>('mainnet')

  useEffect(() => {
    generateRandomPrivateKey()
  }, [])

  const generateRandomPrivateKey = () => {
    setPrivateKey(generatePrivateKey().hexadecimal)
  }

  useEffect(() => {
    if (!privateKey) return

    if (!isValidPrivateKey(privateKey)) setIsErrorPrivateKey(true)
    else {
      setIsErrorPrivateKey(false)
      getPublicKeyPoint()
    }
  }, [privateKey])

  useEffect(() => {
    if (!publicKey) return

    try {
      if (!isCompressedPublicKey(publicKey)) {
        setIsErrorPublicKey(true)
      } else {
        setIsErrorPublicKey(false)
        setPublicKeyX(publicKey.slice(2))
      }
    } catch (error) {
      setIsErrorPublicKey(true)
    }
  }, [publicKey])

  useEffect(() => {
    if (!publicKey || !privateKey) return
    calculateAddress()
  }, [network])

  useEffect(() => {
    if (!publicKeyX) return
    calculateAddress()
  }, [publicKeyX])

  const getPublicKeyPoint = async () => {
    const point = await calculatePublicKeyPoint(privateKey)
    setPublicKey(point.compressedPublicKey)
    setPublicKeyX(point.xHex)
  }

  const calculateAddress = () => {
    const tweakedKey = tweakKey(
      Uint8Array.from(Buffer.from(publicKeyX, 'hex')),
      undefined // 没有脚本树
    )
    if (!tweakedKey) return

    setTPubKey(toHex(tweakedKey.x))

    const words = bech32m.toWords(tweakedKey.x)
    setBech32Words(Buffer.from(Uint8Array.from(words)).toString('hex'))

    const witnessVersion = 0x01
    words.unshift(witnessVersion)
    setVersionedWords(Buffer.from(Uint8Array.from(words)).toString('hex'))

    const address = bech32m.encode(ADDRESS_BECH32_PREFIX[network], words)
    setAddress(address)
  }

  return (
    <InteractionCard
      title='Taproot 地址生成器'
      description='从公钥生成 P2TR 地址'
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

      <div className='text-sm font-medium mt-4 mb-0.5'>压缩公钥</div>
      <Input
        value={publicKey}
        className={cn(
          'bg-background text-base',
          isErrorPublicKey && 'bg-red-200'
        )}
        onChange={(e) => setPublicKey(e.target.value)}
      />

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 1: X坐标
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-sm'>
              <span>公钥的 X 坐标作为内部公钥 P</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-10'>
        <span className={`${COLORS[0]}`}>{publicKeyX}</span>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 2: 计算 Taproot 公钥
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-sm'>
              <ul>
                <li>1. 计算 tweak 值 t </li>
                <li>2. 计算新的点 Q = P + t * G </li>
                <li>3. 返回 Q 的 x 坐标作为最终的 Taproot 公钥</li>
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-10'>
        <span className={`${COLORS[1]}`}>{tPubKey}</span>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 3: 字节分组
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-10'>
        <span className={`${COLORS[2]}`}>{bech32Words}</span>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 4: 添加版本前缀
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-sm'>见证版本 0x01</div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-10'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(COLORS[3], HOVERBGCOLORS[3])}>
              {versionedWords.slice(0, 2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>版本前缀</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(COLORS[2], HOVERBGCOLORS[2])}>
              {versionedWords.slice(2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>字节分组</span>
          </TooltipContent>
        </Tooltip>
      </div>

      <RadioGroup
        className='flex mt-4'
        value={network}
        onValueChange={(v: keyof typeof ADDRESS_BECH32_PREFIX) => setNetwork(v)}
      >
        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='mainnet'
            id='bech32m_mainnet'
          />
          <Label htmlFor='bech32m_mainnet'>主网</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='testnet'
            id='bech32m_testnet'
          />
          <Label htmlFor='bech32m_testnet'>测试网</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='regtest'
            id='bech32m_regtest'
          />
          <Label htmlFor='bech32m_regtest'>回归测试网</Label>
        </div>
      </RadioGroup>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 5: Bech32m 编码
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <span>Bech32m 编码后的结果即为最终的地址</span>
            <ul className='mt-4'>
              <li>主网前缀 bc</li>
              <li>测试网前缀 tb</li>
              <li>回归测试网前缀 bcrt</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-10'>
        <span className={`${COLORS[3]}`}>{address}</span>
      </div>
    </InteractionCard>
  )
}
