'use client'

import { calculatePublicKeyPoint, generateSeed } from '@/lib/blockchain/keys'
import { GETCOLORS, GETHOVERBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { isHexadecimal } from '@/lib/validator'
import ecc, { privateAdd } from '@bitcoinerlab/secp256k1'
import { hmac } from '@noble/hashes/hmac'
import { sha512 } from '@noble/hashes/sha512'
import { hash160, hash256 } from 'bitcoinjs-lib/src/crypto'
import base58 from 'bs58'
import { useEffect, useState } from 'react'
import { fromHex, toHex } from 'uint8array-tools'
import InteractionCard from '../interaction-card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface DeriveSubKeyProps {
  showSerialized?: boolean
}

export default function DeriveSubKey({
  showSerialized = false
}: DeriveSubKeyProps) {
  const [seed, setSeed] = useState(
    '333da71c53ae1a77e2afd6d2f4d45a65ef67a640d9fb92fa96c6fee18599bbfaaab41ad02397dba5ce1d94a626b313747fa3e0f516ca16b225e105050909f134'
  )
  const [isErrorSeed, setIsErrorSeed] = useState(false)
  const [extendedKey, setExtendedKey] = useState('')
  const [deriveIndex, setDeriveIndex] = useState(0)
  const [subPrivate, setSubPrivate] = useState('')
  const [subPublic, setSubPublic] = useState('')
  const [subChainCode, setSubChainCode] = useState('')

  const [subFormatedPrivate, setSubFormatedPrivate] = useState('')
  const [subFormatedPublic, setSubFormatedPublic] = useState('')

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

    res.subarray(0, 32)
    setExtendedKey(toHex(res))
  }

  useEffect(() => {
    if (!extendedKey) return
    deriveSubKey(deriveIndex)
  }, [deriveIndex, extendedKey])

  const deriveSubKey = (index: number) => {
    const parentPrivateKey = fromHex(extendedKey.slice(0, 64))
    const parentChainCode = fromHex(extendedKey.slice(64))

    const indexBuffer = new Uint8Array(4)
    new DataView(indexBuffer.buffer).setUint32(0, index, false)

    let data: Uint8Array = new Uint8Array()
    let parentPublicKey = ecc.pointFromScalar(parentPrivateKey, true)
    if (!parentPublicKey) return

    if (index < 2147483648) {
      // normal derivation
      data = new Uint8Array([...parentPublicKey, ...indexBuffer])
    } else {
      // hardened derivation
      data = new Uint8Array([0, ...parentPrivateKey, ...indexBuffer])
    }

    const I = hmac(sha512, parentChainCode, data)

    const IL = I.slice(0, 32)
    const IR = I.slice(32) // child chain code
    setSubChainCode(toHex(IR))

    const ki = privateAdd(parentPrivateKey, IL)

    if (ki === null) deriveSubKey(index + 1)
    else {
      const subPrivate = toHex(ki)
      const subPublic = calculatePublicKeyPoint(toHex(ki)).compressedPublicKey
      setSubPrivate(subPrivate)

      setSubPublic(subPublic)

      if (!showSerialized) return

      const depth = '01'
      const fingerprint = hash160(Buffer.from(parentPublicKey))
        .subarray(0, 4)
        .toString('hex')

      const childIndex = toHex(indexBuffer)
      const childChainCode = toHex(IR)

      // console.log(`version: ${version}`)
      // console.log(`depth: ${depth}`)
      // console.log(`fingerprint: ${fingerprint}`)
      // console.log(`childIndex: ${childIndex}`)
      // console.log(`childChainCode: ${childChainCode}`)
      // console.log(`key: ${key}`)

      const xprvCombine = `0488ade4${depth}${fingerprint}${childIndex}${childChainCode}00${subPrivate}`
      const xpubCombine = `0488b21e${depth}${fingerprint}${childIndex}${childChainCode}${subPublic}`

      const xprvHash256 = hash256(Buffer.from(xprvCombine, 'hex'))
      const xpubHash256 = hash256(Buffer.from(xpubCombine, 'hex'))

      const xprvChecksum = xprvHash256.subarray(0, 4)
      const xpubChecksum = xpubHash256.subarray(0, 4)

      setSubFormatedPrivate(
        base58.encode(
          Buffer.concat([Buffer.from(xprvCombine, 'hex'), xprvChecksum])
        )
      )
      setSubFormatedPublic(
        base58.encode(
          Buffer.concat([Buffer.from(xpubCombine, 'hex'), xpubChecksum])
        )
      )
    }
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

      <div className='text-sm font-medium mt-4 mb-0.5'>
        <Label>
          索引 - {deriveIndex > 2147483647 ? '硬化派生' : '普通派生'}
        </Label>

        <Input
          max={4294967295}
          min={0}
          value={deriveIndex}
          type='number'
          className='bg-background text-base'
          onChange={(e) => setDeriveIndex(Number(e.target.value))}
        />
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>
        <Label>子私钥</Label>
        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          <span className={cn(GETCOLORS(2))}>{subPrivate}</span>
        </div>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>
        <Label>子公钥</Label>

        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          <span className={cn(GETCOLORS(3))}>{subPublic}</span>
        </div>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>
        <Label>子链码</Label>
        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          <span className={cn(GETCOLORS(4))}>{subChainCode}</span>
        </div>
      </div>

      {showSerialized && (
        <div>
          <div className='text-sm font-medium mt-4 mb-0.5'>
            <Label>子拓展私钥序列化</Label>

            <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
              <span className={cn(GETCOLORS(5))}>{subFormatedPrivate}</span>
            </div>
          </div>

          <div className='text-sm font-medium mt-4 mb-0.5'>
            <Label>子拓展公钥序列化</Label>

            <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
              <span className={cn(GETCOLORS(6))}>{subFormatedPublic}</span>
            </div>
          </div>
        </div>
      )}
    </InteractionCard>
  )
}
