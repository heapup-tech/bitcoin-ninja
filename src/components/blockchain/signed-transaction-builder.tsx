'use client'

import ECPair from '@/lib/blockchain/ecpair'
import { getScriptType } from '@/lib/blockchain/script-utils'
import { script, Transaction } from 'bitcoinjs-lib'
import { hash256 } from 'bitcoinjs-lib/src/crypto'
import { useEffect, useState } from 'react'
import { toHex } from 'uint8array-tools'
import ContentCard from '../content-card'
import InteractionCard from '../interaction-card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Textarea } from '../ui/textarea'
import TransactionSplitTab from './transaction-split-tab'

interface SignTransactionProps {
  hex: string // unsigned transaction hex
}

export default function SignedTransactionBuilder({
  hex
}: SignTransactionProps) {
  const [privateKey, setPrivateKey] = useState(
    '585d4bc6533320c1586cb4c4831818a4e418d1f7d0e2a5313169e65a450f7b9d'
  )
  const [unsignedRawTransaction, setUnsignedRawTransaction] = useState(
    hex ||
      '02000000020323f0c5cdd3408336cd7e6b6df9cf0ccde996f363b64a066497a5a60c44f7e4000000001976a914c189d7f7ea4333daec66a645cb3388163c22900b88acffffffffcd048bf2054b6885f29246ed1ae55c0e329ed3f0ccaa2d597c6b99b0ed3b9716204e0000160014c189d7f7ea4333daec66a645cb3388163c22900bffffffff016400000000000000225120b2049a6d884575fe95e3fcaeaedae4ec4feaecccc30fad156f12923753c0954e00000000'
  )

  const [unsignedTransaction, setUnsignedTransaction] = useState<Transaction>()
  const [signInputIndex, setSignInputIndex] = useState(0)

  // 特定输入的未签名交易
  const [unsignedTransactionForInput, setUnsignedTransactionForInput] =
    useState<Transaction>()

  const [hashedTransaction, setHashedTransaction] = useState('')
  const [ecdsaSignature, setEcdsaSignature] = useState('')

  const [derSignature, setDerSignature] = useState('')

  useEffect(() => {
    if (!unsignedRawTransaction || !privateKey) return

    try {
      setUnsignedTransaction(Transaction.fromHex(unsignedRawTransaction))
    } catch (error) {}
  }, [unsignedRawTransaction, privateKey])

  useEffect(() => {
    if (!unsignedTransaction) return
    signTx()
  }, [unsignedTransaction, signInputIndex])

  const signTx = () => {
    if (!unsignedTransaction) return

    const keypair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))

    const tx = unsignedTransaction.clone()
    tx.ins.forEach((input, index) => {
      if (index !== signInputIndex) {
        input.script = Buffer.from('', 'hex')
      }
    })

    const waitingForSignTx = tx.toHex() + '01000000'
    console.log(`waitingForSignTx: `, waitingForSignTx)

    setUnsignedTransactionForInput(tx)

    // hash256
    const hashedTransaction = hash256(Buffer.from(waitingForSignTx, 'hex'))
    setHashedTransaction(toHex(hashedTransaction))

    // ecdsa 签名
    const ecdsaSignature = keypair.sign(hashedTransaction)
    setEcdsaSignature(toHex(ecdsaSignature))

    // Der 编码
    const derSignature = script.signature.encode(ecdsaSignature, 0x01)
    setDerSignature(toHex(derSignature))
  }

  return (
    <InteractionCard title='签名交易'>
      <ContentCard title='未签名交易'>
        <Textarea
          className='bg-background text-lg'
          value={unsignedRawTransaction}
          rows={5}
          onChange={(e) => setUnsignedRawTransaction(e.target.value)}
        />
      </ContentCard>

      <ContentCard title='私钥'>
        <Input
          className='bg-background'
          type='text'
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
      </ContentCard>
      {unsignedTransaction && unsignedTransaction.ins.length > 0 && (
        <Tabs
          defaultValue={signInputIndex + ''}
          onValueChange={(v) => setSignInputIndex(Number(v))}
          className='mt-4'
        >
          <TabsList className='flex'>
            {unsignedTransaction.ins.map((_, index) => (
              <TabsTrigger
                key={index}
                value={index + ''}
                className='w-full'
              >
                Input {index} -{' '}
                {getScriptType(toHex(unsignedTransaction.ins[index].script))}
              </TabsTrigger>
            ))}
          </TabsList>

          {unsignedTransaction.ins.map((input, index) => (
            <TabsContent
              value={index + ''}
              key={toHex(input.hash) + index}
            >
              <Label className='relative mb-3'>签名数据</Label>
              <TransactionSplitTab
                hex={unsignedTransactionForInput?.toHex()}
                className='mt-0.5'
              />
              <ContentCard
                title='Hash256'
                content={hashedTransaction}
              />

              <ContentCard
                title='ECDSA 签名'
                content={ecdsaSignature}
              />

              <ContentCard
                title='DER 编码'
                content={derSignature}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </InteractionCard>
  )
}
