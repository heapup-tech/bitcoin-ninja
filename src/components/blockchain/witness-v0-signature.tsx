'use client'

import { decimalToFixedByteHex } from '@/lib/blockchain/bytes'
import ECPair from '@/lib/blockchain/ecpair'
import { GETCOLORS, GETHOVERBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { script } from 'bitcoinjs-lib'
import { hash256 } from 'bitcoinjs-lib/src/crypto'
import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toHex } from 'uint8array-tools'
import ContentCard from '../content-card'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface WitnessV0SignatureProps {
  witnessV0Msg?: WitnessV0Message
  privateKey: string
  sigHash: number
}
export default function WitnessV0Signature({
  witnessV0Msg,
  privateKey,
  sigHash
}: WitnessV0SignatureProps) {
  const [hashedSigMessage, setHashedSigMessage] = useState('')
  const [ecdsaSignature, setEcdsaSignature] = useState('')
  const [derSignature, setDerSignature] = useState('')
  const sigHashBuffer = Buffer.from(
    decimalToFixedByteHex(sigHash, 4, true),
    'hex'
  )
  useEffect(() => {
    if (!witnessV0Msg || !privateKey) return

    const keypair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))

    const sigMsgBuffer = Buffer.concat([
      Buffer.from(witnessV0Msg.sigMsg, 'hex'),
      sigHashBuffer
    ])

    const hash = hash256(sigMsgBuffer)
    setHashedSigMessage(toHex(hash))

    // ecdsa 签名
    const ecdsaSignature = keypair.sign(hash)
    setEcdsaSignature(toHex(ecdsaSignature))

    // Der 编码
    const derSignature = script.signature.encode(ecdsaSignature, sigHash)
    setDerSignature(toHex(derSignature))
  }, [witnessV0Msg, privateKey, sigHash])

  if (!witnessV0Msg) return null
  return (
    <div className='mt-4'>
      <ContentCard title='Step 1: 计算签名数据'>
        <div className='font-semibold bg-background text-lg break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          {witnessV0Msg.version && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(0), GETHOVERBGCOLORS(0))}>
                  {witnessV0Msg.version}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>version</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.hashPrevouts && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}>
                  {witnessV0Msg.hashPrevouts}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>hashPrevouts</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.hashSequence && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(2), GETHOVERBGCOLORS(2))}>
                  {witnessV0Msg.hashSequence}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>hashSequence</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.inputHash && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(3), GETHOVERBGCOLORS(3))}>
                  {witnessV0Msg.inputHash}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的交易ID</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.vout && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(4), GETHOVERBGCOLORS(4))}>
                  {witnessV0Msg.vout}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的交易ID的输出索引</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.prevOutSize && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(5), GETHOVERBGCOLORS(5))}>
                  {witnessV0Msg.prevOutSize}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的锁定脚本的大小</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.prevOut && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(6), GETHOVERBGCOLORS(6))}>
                  {witnessV0Msg.prevOut}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的锁定脚本</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.amount && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(7), GETHOVERBGCOLORS(7))}>
                  {witnessV0Msg.amount}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的输出金额</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.sequence && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(8), GETHOVERBGCOLORS(8))}>
                  {witnessV0Msg.sequence}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的 sequence</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.hashOutputs && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(9), GETHOVERBGCOLORS(9))}>
                  {witnessV0Msg.hashOutputs}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>hashOutputs</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV0Msg.lockTime && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(10), GETHOVERBGCOLORS(10))}>
                  {witnessV0Msg.lockTime}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>交易的 LockTime</span>
              </TooltipContent>
            </Tooltip>
          )}

          {sigHashBuffer && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(11), GETHOVERBGCOLORS(11))}>
                  {toHex(sigHashBuffer)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名哈希类型</span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </ContentCard>

      <ContentCard
        title={
          <div className='font-medium flex items-center gap-x-2'>
            <span>Step 2: 计算签名哈希</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className='w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm'>对签名数据进行 Hash256 运算</div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
        content={hashedSigMessage}
      ></ContentCard>

      <ContentCard
        title={
          <div className='font-medium flex items-center gap-x-2'>
            <span>Step 3: ECDSA 签名</span>
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
            <span>Step 4: DER 编码</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className='w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm'>
                  对 ECDSA 签名进行 DER 编码, 根据锁定脚本类型生成解锁脚本并放入
                  Witness 字段
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
        content={derSignature}
      />
    </div>
  )
}
