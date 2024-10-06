'use client'

import ECPair from '@/lib/blockchain/ecpair'
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

export default function SignedSegwitTransactionBuilder({
  hex
}: SignTransactionProps) {
  const [privateKey, setPrivateKey] = useState(
    '585d4bc6533320c1586cb4c4831818a4e418d1f7d0e2a5313169e65a450f7b9d'
  )
  const [unsignedRawTransaction, setUnsignedRawTransaction] = useState(
    hex ||
      '02000000020323f0c5cdd3408336cd7e6b6df9cf0ccde996f363b64a066497a5a60c44f7e4000000001976a914c189d7f7ea4333daec66a645cb3388163c22900b88acffffffff24cfd0804d4f59028bfc44af04a8e5c8da35773e1ba24453d3a711d4f592a0ee000000001976a914c189d7f7ea4333daec66a645cb3388163c22900b88acffffffff016400000000000000225120b2049a6d884575fe95e3fcaeaedae4ec4feaecccc30fad156f12923753c0954e00000000'
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
    setUnsignedTransactionForInput(tx)

    const hashedTransaction = hash256(Buffer.from(waitingForSignTx, 'hex'))
    setHashedTransaction(toHex(hashedTransaction))

    // 504c3233cdeff27bb141dd3e2bb83f454fd45146e41ed24a25afd011fc996bf41be4584472a75912a797581c33e325fef7c8517d5ce23d83b72027fec69bad89
    const ecdsaSignature = keypair.sign(hashedTransaction)
    setEcdsaSignature(toHex(ecdsaSignature))

    // Der
    const derSignature = script.signature.encode(ecdsaSignature, 0x01)
    setDerSignature(toHex(derSignature))

    const cc = script.signature.decode(
      Buffer.from(
        '3044022061c1fc152fe6ebd54c1b5d0961f8aed9ed90a35d1b0d40348b2aa310ab3b2a1a02203477df635026ca5c2f178e97b6f139ce3cd2d9317e75d6ae26c74858158ef45d01',
        'hex'
      )
    )
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
                Input {index}
              </TabsTrigger>
            ))}
          </TabsList>

          {unsignedTransaction.ins.map((input, index) => (
            <TabsContent
              value={index + ''}
              key={toHex(input.hash) + index}
            >
              <Label className='relative mb-3'>未签名交易</Label>
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
