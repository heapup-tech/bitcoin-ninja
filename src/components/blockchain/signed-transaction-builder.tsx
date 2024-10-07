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
      '02000000020323f0c5cdd3408336cd7e6b6df9cf0ccde996f363b64a066497a5a60c44f7e40000000000ffffffffcd048bf2054b6885f29246ed1ae55c0e329ed3f0ccaa2d597c6b99b0ed3b97160000000000ffffffff016400000000000000225120b2049a6d884575fe95e3fcaeaedae4ec4feaecccc30fad156f12923753c0954e00000000'
  )
  const [utxos, setUtxos] = useState<
    {
      script: string
      amount: bigint
      type: Uppercase<ScriptType | 'unknown'>
    }[]
  >([
    {
      script: '76a914c189d7f7ea4333daec66a645cb3388163c22900b88ac',
      type: 'P2PKH',
      amount: 0n
    },
    {
      script: '0014c189d7f7ea4333daec66a645cb3388163c22900b',
      type: 'P2WPKH',
      amount: 20000n
    }
  ])

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

    if (unsignedTransaction.ins.length > utxos.length) {
      const newUtxos = [...utxos]
      for (let i = utxos.length; i < unsignedTransaction.ins.length; i++) {
        newUtxos.push({
          script: '',
          amount: 0n,
          type: 'UNKNOWN'
        })
      }
      setUtxos(newUtxos)
    } else if (unsignedTransaction.ins.length < utxos.length) {
      const newUtxos = utxos.slice(0, unsignedTransaction.ins.length)
      setUtxos(newUtxos)
    }

    signTx()
  }, [unsignedTransaction, signInputIndex])

  const signTx = () => {
    if (!unsignedTransaction) return

    const keypair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))

    const tx = unsignedTransaction.clone()
    tx.ins.forEach((input, index) => {
      if (index === signInputIndex) {
        const utxo = utxos[index]
        if (utxo.type === 'P2TR') {
        } else if (utxo.type === 'P2WPKH') {
          input.witness = [
            Buffer.from(utxo.script, 'hex'),
            keypair.sign(hash256(Buffer.from(tx.toHex(), 'hex')))
          ]
        } else {
          input.script = Buffer.from(utxo.script, 'hex')
        }
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
                Input {index} - {utxos[index] ? utxos[index].type : 'UNKNOWN'}
              </TabsTrigger>
            ))}
          </TabsList>

          {unsignedTransaction.ins.map((input, index) => (
            <TabsContent
              value={index + ''}
              key={toHex(input.hash) + index}
              className='mt-4'
            >
              <ContentCard title='UTXO 信息'>
                <div className='flex items-center gap-x-4'>
                  <Input
                    className='bg-background'
                    placeholder='ScriptPubKey'
                    value={utxos[index].script}
                    onChange={(e) => {
                      const newUtxos = [...utxos]
                      newUtxos[index].script = e.target.value
                      newUtxos[index].type = getScriptType(e.target.value)
                      setUtxos(newUtxos)
                    }}
                  />
                  {utxos[index].type === 'P2WPKH' && (
                    <Input
                      placeholder='Amount'
                      className='bg-background w-40'
                      value={utxos[index].amount.toString()}
                      onChange={(e) => {
                        const newUtxos = [...utxos]
                        newUtxos[index].amount = BigInt(e.target.value)
                        setUtxos(newUtxos)
                      }}
                    />
                  )}
                </div>
              </ContentCard>

              <div className='mt-4'>
                <Label className='relative mb-3'>签名数据</Label>
                <TransactionSplitTab
                  hex={unsignedTransactionForInput?.toHex()}
                  className='mt-0.5'
                />
              </div>
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
