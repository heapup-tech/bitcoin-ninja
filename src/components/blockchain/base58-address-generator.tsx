'use client'

import InteractionCard from '@/components/interaction-card'
import { Button } from '@/components/ui/button'
import {
  calculatePublicKeyPoint,
  generatePrivateKey
} from '@/lib/blockchain/keys'
import {
  ADDRESS_BASE58_PREFIX,
  GETCOLORS,
  GETHOVERBGCOLORS
} from '@/lib/constants'
import { cn } from '@/lib/utils'
import { isHexadecimal, isValidPrivateKey } from '@/lib/validator'
import { payments } from 'bitcoinjs-lib'
import { ripemd160, sha256 } from 'bitcoinjs-lib/src/crypto'
import base58 from 'bs58'
import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function Base58AddressGenerator() {
  const [privateKey, setPrivateKey] = useState('')
  const [isErrorPublicKey, setIsErrorPublicKey] = useState(false)

  const [publicKey, setPublicKey] = useState('')
  const [redeemScript, setRedeemScript] = useState('')

  const [hash160Res, setHash160Res] = useState('')
  const [versionedHash160, setVersionedHash160] = useState('')

  const [checksum, setChecksum] = useState('')
  const [address, setAddress] = useState('')

  const [network, setNetwork] =
    useState<keyof typeof ADDRESS_BASE58_PREFIX>('mainnet')
  const [addressType, setAddressType] =
    useState<keyof (typeof ADDRESS_BASE58_PREFIX)['mainnet']>('p2pkh')

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
    let hash160Res: Buffer = Buffer.alloc(0)
    if (addressType === 'p2pkh') {
      const publicKeyBuffer = Buffer.from(publicKey, 'hex')
      hash160Res = ripemd160(sha256(publicKeyBuffer))
      setHash160Res(hash160Res.toString('hex'))
    } else if (addressType === 'p2sh') {
      const redeemScriptBuffer = Buffer.from(redeemScript, 'hex')
      hash160Res = ripemd160(sha256(redeemScriptBuffer))
      setHash160Res(hash160Res.toString('hex'))
    }

    const prefix = ADDRESS_BASE58_PREFIX[network][addressType]
    const versionHash160 = Buffer.concat([Buffer.from([prefix]), hash160Res])
    setVersionedHash160(versionHash160.toString('hex'))

    let doubleSha256 = sha256(sha256(versionHash160))
    const checksum = doubleSha256.subarray(0, 4)
    setChecksum(checksum.toString('hex'))

    const address = base58.encode(Buffer.concat([versionHash160, checksum]))
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

    if (!redeemScript) {
      setRedeemScript(
        payments
          .p2wpkh({
            pubkey: Buffer.from(publicKey, 'hex')
          })
          .output!.toString('hex')
      )
    }
    calculateAddress()
  }, [publicKey])

  useEffect(() => {
    if (!publicKey || !privateKey) return

    calculateAddress()
  }, [network, addressType, redeemScript])

  return (
    <InteractionCard
      title='Base58 地址生成器'
      description='从公钥生成 P2PKH 地址'
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
          !isValidPrivateKey(privateKey) && 'bg-red-200' && 'bg-red-200'
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

      <RadioGroup
        className='flex mt-4'
        value={network}
        onValueChange={(v: keyof typeof ADDRESS_BASE58_PREFIX) => setNetwork(v)}
      >
        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='mainnet'
            id='mainnet'
          />
          <Label htmlFor='mainnet'>主网</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='testnet'
            id='testnet'
          />
          <Label htmlFor='testnet'>测试网</Label>
        </div>
      </RadioGroup>

      <RadioGroup
        className='flex mt-4'
        value={addressType}
        onValueChange={(v: keyof (typeof ADDRESS_BASE58_PREFIX)['mainnet']) =>
          setAddressType(v)
        }
      >
        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='p2pkh'
            id='base58_p2pkh'
          />
          <Label htmlFor='base58_p2pkh'>P2PKH</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <RadioGroupItem
            value='p2sh'
            id='base58_p2sh'
          />
          <Label htmlFor='base58_p2sh'>P2SH</Label>
        </div>
      </RadioGroup>

      {addressType === 'p2pkh' && (
        <>
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
          <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
            <span className={cn(GETCOLORS(0))}>{hash160Res}</span>
          </div>
        </>
      )}

      {addressType === 'p2sh' && (
        <>
          <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
            赎回脚本
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className='w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm'>默认为 P2WPKH 锁定脚本</div>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            value={redeemScript}
            className={cn(
              'bg-background text-base',
              !isHexadecimal(redeemScript) && 'bg-red-200' && 'bg-red-200'
            )}
            onChange={(e) => setRedeemScript(e.target.value)}
          />
          <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2'>
            Step 1: 脚本哈希
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
          <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
            <span className={cn(GETCOLORS(0))}>{hash160Res}</span>
          </div>
        </>
      )}

      <div className='text-sm font-medium mt-4 mb-0.5 flex items-center gap-x-2 '>
        Step 2: 添加版本前缀
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className='w-4' />
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-sm'>
              版本前缀:
              <ul>
                <li>主网 P2PKH: 0x00</li>
                <li>主网 P2SH: 0x05</li>
                <li>测试网 P2PKH: 0x6f</li>
                <li>测试网 P2SH: 0xc4</li>
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}>
              {versionedHash160.slice(0, 2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>版本前缀</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(GETCOLORS(0), GETHOVERBGCOLORS(0))}>
              {versionedHash160.slice(2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>公钥哈希</span>
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
              对{' '}
              <span className='text-fuchsia-100 font-semibold text-base'>
                {versionedHash160}{' '}
              </span>
              双重 Sha256 后取前 4 个字节作为校验和, 并添加到字符串
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}>
              {versionedHash160.slice(0, 2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>版本前缀</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(GETCOLORS(0), GETHOVERBGCOLORS(0))}>
              {versionedHash160.slice(2)}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span>公钥哈希</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(GETCOLORS(2), GETHOVERBGCOLORS(2))}>
              {checksum}
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
            <span>Base58 编码后的结果即为最终的地址</span>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
        <span className={cn(GETCOLORS(3))}>{address}</span>
      </div>
    </InteractionCard>
  )
}
