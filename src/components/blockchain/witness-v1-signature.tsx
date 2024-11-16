'use client'

import ECPair from '@/lib/blockchain/ecpair'
import { tweakSigner } from '@/lib/blockchain/taproot-signature'
import { GETCOLORS, GETHOVERBGCOLORS, NETWORKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { taggedHash } from 'bitcoinjs-lib/src/crypto'
import { CircleHelp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toHex } from 'uint8array-tools'
import ContentCard from '../content-card'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface WitnessV1SignatureProps {
  witnessV1Msg?: WitnessV1Message
  privateKey: string
  sigHash: number
  network: keyof typeof NETWORKS
}
export default function WitnessV1Signature({
  witnessV1Msg,
  privateKey,
  sigHash,
  network
}: WitnessV1SignatureProps) {
  const [tapKeyHash, setTapKeyHash] = useState('')

  const [tweak, setTweak] = useState('')
  const [tweakedPrivateKey, setTweakedPrivateKey] = useState('')

  const [schnorrSignature, setSchnorrSignature] = useState('')

  const [serialzedSignature, setSerialzedSignature] = useState('')

  useEffect(() => {
    if (!witnessV1Msg || !privateKey) return

    const keypair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))

    const tapKeyHash = taggedHash(
      'TapSighash',
      Buffer.concat([
        Buffer.from([0x00]),
        Buffer.from(witnessV1Msg.sigMsg, 'hex')
      ])
    )
    setTapKeyHash(toHex(tapKeyHash))

    const { tweak, tweakedPrivateKey, tweakedSigner } = tweakSigner(
      keypair,
      NETWORKS[network].network
    )
    setTweak(toHex(tweak))
    setTweakedPrivateKey(toHex(tweakedPrivateKey))

    const signature =
      tweakedSigner.signSchnorr && tweakedSigner.signSchnorr(tapKeyHash)
    setSchnorrSignature(toHex(signature))

    const taprootSignature = Buffer.concat([
      signature!,
      (sigHash !== 0 && Buffer.from([sigHash])) || Buffer.from([])
    ])
    setSerialzedSignature(toHex(taprootSignature))
  }, [witnessV1Msg, privateKey, sigHash])

  if (!witnessV1Msg) return null

  return (
    <div className='mt-4'>
      <ContentCard title='Step 1: 计算签名数据'>
        <div className='font-semibold bg-background text-lg break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(GETCOLORS(0), GETHOVERBGCOLORS(0))}>
                {sigHash.toString(16).padStart(2, '0')}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>sigHash</span>
            </TooltipContent>
          </Tooltip>

          {witnessV1Msg.version && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}>
                  {witnessV1Msg.version}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>version</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.lockTime && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(2), GETHOVERBGCOLORS(2))}>
                  {witnessV1Msg.lockTime}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>lockTime</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.hashPrevouts && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(3), GETHOVERBGCOLORS(3))}>
                  {witnessV1Msg.hashPrevouts}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>hashPrevouts</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.hashAmounts && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(4), GETHOVERBGCOLORS(4))}>
                  {witnessV1Msg.hashAmounts}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>hashAmounts</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.hashScriptPubKeys && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(5), GETHOVERBGCOLORS(5))}>
                  {witnessV1Msg.hashScriptPubKeys}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>hashScriptPubKeys</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.hashSequences && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(6), GETHOVERBGCOLORS(6))}>
                  {witnessV1Msg.hashSequences}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>hashSequences</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.hashOutputs && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(7), GETHOVERBGCOLORS(7))}>
                  {witnessV1Msg.hashOutputs}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>hashOutputs</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.spendType && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(8), GETHOVERBGCOLORS(8))}>
                  {witnessV1Msg.spendType}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>spendType</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.inputHash && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(9), GETHOVERBGCOLORS(9))}>
                  {witnessV1Msg.inputHash}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的交易ID</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.vout && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(10), GETHOVERBGCOLORS(10))}>
                  {witnessV1Msg.vout}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的交易ID的输出索引</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.value && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(11), GETHOVERBGCOLORS(11))}>
                  {witnessV1Msg.value}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的花费金额</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.scriptPubKeySize && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(12), GETHOVERBGCOLORS(12))}>
                  {witnessV1Msg.scriptPubKeySize}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的锁定脚本的大小</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.scriptPubKey && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(13), GETHOVERBGCOLORS(13))}>
                  {witnessV1Msg.scriptPubKey}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的锁定脚本</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.sequence && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(14), GETHOVERBGCOLORS(14))}>
                  {witnessV1Msg.sequence}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入的 sequence</span>
              </TooltipContent>
            </Tooltip>
          )}

          {witnessV1Msg.inIndex && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={cn(GETCOLORS(15), GETHOVERBGCOLORS(15))}>
                  {witnessV1Msg.inIndex}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span>签名的交易输入在整个交易输入中的索引</span>
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
                <div className='text-sm'>
                  在签名数据前添加 TapSighash 标记, 并进行 Sha256 运算
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
        content={tapKeyHash}
      ></ContentCard>

      <ContentCard
        title={
          <div className='font-medium flex items-center gap-x-2'>
            <span>Step 3: 计算 Tweak</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className='w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm'>
                  仅支持脚本树为空, Tweak 值等于原始公钥添加 TapTweak 标记,
                  并进行 Sha256 运算
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
        content={tweak}
      ></ContentCard>

      <ContentCard
        title={
          <div className='font-medium flex items-center gap-x-2'>
            <span>Step 4: 计算 Taproot 私钥</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className='w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm'>原始私钥加上脚本树的 tweak 值</div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
        content={tweakedPrivateKey}
      ></ContentCard>

      <ContentCard
        title={
          <div className='font-medium flex items-center gap-x-2'>
            <span>Step 5: Schnorr 签名</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp className='w-4' />
              </TooltipTrigger>
              <TooltipContent>
                <div className='text-sm'>
                  使用 Taproot 私钥对签名哈希进行 Schnorr 签名
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
        content={schnorrSignature}
      />

      {sigHash !== 0 && (
        <ContentCard
          title={
            <div className='font-medium flex items-center gap-x-2'>
              <span>Step 6: 签名序列化</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleHelp className='w-4' />
                </TooltipTrigger>
                <TooltipContent>
                  <div className='text-sm'>
                    SigHash 不是 SIGHASH_DEFAULT 时, 签名末尾添加 SigHash
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          }
          content={serialzedSignature}
        />
      )}
    </div>
  )
}
