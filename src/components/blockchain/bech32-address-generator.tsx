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
import {
  ADDRESS_BECH32_PREFIX,
  GETCOLORS,
  GETHOVERBGCOLORS
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { isValidPrivateKey } from '@/lib/validator'
import { bech32 } from 'bech32'
import { ripemd160, sha256 } from 'bitcoinjs-lib/src/crypto'
import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

export default function Bech32AddressGenerator() {
  const [privateKey, setPrivateKey] = useState('')
  const [isErrorPublicKey, setIsErrorPublicKey] = useState(false)
  const [publicKey, setPublicKey] = useState('')
  const [hash160PublicKey, setHash160PublicKey] = useState('')
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
    if (isValidPrivateKey(privateKey)) {
      getPublicKeyPoint()
    }
  }, [privateKey])

  const getPublicKeyPoint = async () => {
    const point = await calculatePublicKeyPoint(privateKey)
    setPublicKey(point.compressedPublicKey)
  }

  const calculateAddress = () => {
    const publicKeyBuffer = Buffer.from(publicKey, 'hex')

    const hash160PublicKey = ripemd160(sha256(publicKeyBuffer))
    setHash160PublicKey(hash160PublicKey.toString('hex'))

    const words = bech32.toWords(hash160PublicKey)
    setBech32Words(Buffer.from(Uint8Array.from(words)).toString('hex'))

    const witnessVersion = 0x00
    words.unshift(witnessVersion)
    setVersionedWords(Buffer.from(Uint8Array.from(words)).toString('hex'))

    const address = bech32.encode(ADDRESS_BECH32_PREFIX[network], words)
    setAddress(address)
  }

  useEffect(() => {
    if (!publicKey) return
    if (
      (!publicKey.startsWith('02') && !publicKey.startsWith('03')) ||
      publicKey.length !== 66
    ) {
      setIsErrorPublicKey(true)
      return
    }
    setIsErrorPublicKey(false)
    calculateAddress()
  }, [publicKey])

  useEffect(() => {
    if (!publicKey || !privateKey) return
    calculateAddress()
  }, [network])

  return (
    <InteractionCard
      title='Bech32 地址生成器'
      description='从公钥生成 P2WPKH 地址'
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
          !isValidPrivateKey(privateKey) && 'bg-red-200'
        )}
        onChange={(e) => setPrivateKey(e.target.value)}
      />

      <div className='text-sm font-medium mt-4 mb-0.5'>公钥</div>
      <Input
        value={publicKey}
        className={cn(
          'bg-background text-base',
          isErrorPublicKey && 'bg-red-200'
        )}
        onChange={(e) => setPublicKey(e.target.value)}
      />

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 1: 公钥哈希
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-sm'>
              公钥哈希(Hash160) = Ripemd160(Sha256(CompressedPublicKey))
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5'>
        <span className={cn(GETCOLORS(0))}>{hash160PublicKey}</span>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 2: 字节分组
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-sm'>
              <ul>
                <li>1. 转换 Hash160 为二进制</li>
                <li>2. 每 5 个比特位一组 </li>
                <li>3. 最后一组不足 5 位补零</li>
              </ul>

              <strong className='mt-2'>示例:</strong>
              <div>二进制数据: 0111 0101 0001 1110 0111 0110 1110 1000</div>
              <div>每 5 位一组: 01110 10100 01111 00111 01101 11010 00</div>
              <div>
                最后一组不足 5 位补零: 01110 10100 01111 00111 01101 11010 00000
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5'>
        <span className={cn(GETCOLORS(1))}>{bech32Words}</span>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 2: 添加版本前缀
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-sm'>见证版本 0x00</div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(GETCOLORS(2), GETHOVERBGCOLORS(2))}>
              {versionedWords.slice(0, 2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>版本前缀</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}>
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
            id='bech32_mainnet'
          />
          <Label htmlFor='bech32_mainnet'>主网</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='testnet'
            id='bech32_testnet'
          />
          <Label htmlFor='bech32_testnet'>测试网</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='regtest'
            id='bech32_regtest'
          />
          <Label htmlFor='bech32_regtest'>回归测试网</Label>
        </div>
      </RadioGroup>

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
        Step 3: Bech32 编码
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <span>Bech32 编码后的结果即为最终的地址</span>
            <ul className='mt-4'>
              <li>主网前缀 bc</li>
              <li>测试网前缀 tb</li>
              <li>回归测试网前缀 bcrt</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5'>
        <span className={cn(GETCOLORS(2))}>{address}</span>
      </div>
    </InteractionCard>
  )
}
