'use client'

import { decimalToFixedByteHex } from '@/lib/blockchain/bytes'
import ECPair from '@/lib/blockchain/ecpair'
import { GETCOLORS, GETHOVERBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { script, Transaction } from 'bitcoinjs-lib'
import { hash256 } from 'bitcoinjs-lib/src/crypto'
import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toHex } from 'uint8array-tools'
import ContentCard from '../content-card'
import { Label } from '../ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import TransactionSplitTab from './transaction-split-tab'

interface NoWitnessSignatureProps {
  unsignedTransactionForInput?: Transaction
  privateKey: string
  sigHash: number
}

export default function NoWitnessSignature({
  unsignedTransactionForInput,
  sigHash,
  privateKey
}: NoWitnessSignatureProps) {
  const [hashedSigMessage, setHashedSigMessage] = useState('')
  const [ecdsaSignature, setEcdsaSignature] = useState('')
  const [derSignature, setDerSignature] = useState('')

  useEffect(() => {
    if (!unsignedTransactionForInput || !privateKey) return

    const keypair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))

    const hashTypeHex = decimalToFixedByteHex(sigHash, 4, true)

    const waitingForSignTx = unsignedTransactionForInput.toHex() + hashTypeHex

    // hash256
    const hashedTransaction = hash256(Buffer.from(waitingForSignTx, 'hex'))
    setHashedSigMessage(toHex(hashedTransaction))

    // ecdsa 签名
    const ecdsaSignature = keypair.sign(hashedTransaction)
    setEcdsaSignature(toHex(ecdsaSignature))

    // Der 编码
    const derSignature = script.signature.encode(ecdsaSignature, sigHash)
    setDerSignature(toHex(derSignature))
  }, [unsignedTransactionForInput, sigHash, privateKey])

  return (
    <div>
      <div className='mt-4'>
        <Label className='relative mb-3'>签名数据</Label>
        <TransactionSplitTab
          hex={unsignedTransactionForInput?.toHex()}
          className='mt-0.5'
        />
      </div>
      <ContentCard
        title={
          <div className='font-medium flex items-center gap-x-2'>
            <span>Step 1: 计算签名哈希</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className='w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm'>
                  签名数据末尾添加小端序 4 字节的签名哈希类型, 并对结果进行
                  Hash256 运算
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
        content={hashedSigMessage}
      ></ContentCard>

      <ContentCard
        title={
          <div className='font-medium flex items-center gap-x-2'>
            <span>Step 2: ECDSA 签名</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className='w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm'>使用私钥对签名哈希进行 ECDSA 签名</div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
      >
        <div className='font-semibold bg-background text-lg break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(GETCOLORS(0), GETHOVERBGCOLORS(0))}>
                {ecdsaSignature.slice(0, 64)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>签名结果前32字节: R</span>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}>
                {ecdsaSignature.slice(64)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>签名结果后32字节: S</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </ContentCard>

      <ContentCard
        title={
          <div className='font-medium flex items-center gap-x-2'>
            <span>Step 3: DER 编码</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className='w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm'>对 ECDSA 签名进行 DER 编码</div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
        content={derSignature}
      />
    </div>
  )
}
