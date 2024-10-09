'use client'

import {
  decimalToCompactHex,
  decimalToFixedByteHex
} from '@/lib/blockchain/bytes'
import ECPair from '@/lib/blockchain/ecpair'
import { getScriptType } from '@/lib/blockchain/script-utils'
import { tweakSigner } from '@/lib/blockchain/taproot-signature'
import { payments, script, Transaction } from 'bitcoinjs-lib'
import { hash256, sha256, taggedHash } from 'bitcoinjs-lib/src/crypto'
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
      '02000000030323f0c5cdd3408336cd7e6b6df9cf0ccde996f363b64a066497a5a60c44f7e40000000000ffffffffcd048bf2054b6885f29246ed1ae55c0e329ed3f0ccaa2d597c6b99b0ed3b97160000000000ffffffff161ec3f56a53829f31665ae94c3d1dee3d4a6b5f1096c0a9f84ce46db70c36770000000000ffffffff016400000000000000225120b2049a6d884575fe95e3fcaeaedae4ec4feaecccc30fad156f12923753c0954e00000000'
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
      amount: 100000n
    },
    {
      script: '0014c189d7f7ea4333daec66a645cb3388163c22900b',
      type: 'P2WPKH',
      amount: 20000n
    },
    {
      script:
        '5120b2049a6d884575fe95e3fcaeaedae4ec4feaecccc30fad156f12923753c0954e',
      type: 'P2TR',
      amount: 500000n
    }
  ])

  const [unsignedTransaction, setUnsignedTransaction] = useState<Transaction>()
  const [signInputIndex, setSignInputIndex] = useState(2)

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

    const input = tx.ins[signInputIndex]
    const utxo = utxos[signInputIndex]

    if (utxo.type === 'P2TR') {
      // 1. hashPrevouts = sha256(txid0 + vout0 + txid1 + vout1 + ...)
      const txidAndVouts = tx.ins.reduce((acc, input) => {
        const txid = toHex(input.hash)
        const vout = decimalToFixedByteHex(Number(input.index), 4, true)

        return acc + txid + vout
      }, '')
      const hashPrevouts = sha256(Buffer.from(txidAndVouts, 'hex'))

      console.log(`hashPrevouts: `, toHex(hashPrevouts))

      // 2. hashAmounts = sha256(amount0 + amount1 + ...)
      const allAmounts = tx.ins.reduce((acc, input, index) => {
        const amount = decimalToFixedByteHex(
          Number(utxos[index].amount),
          8,
          true
        )
        return acc + amount
      }, '')
      console.log(`allAmounts: `, allAmounts)

      const hashAmounts = sha256(Buffer.from(allAmounts, 'hex'))
      console.log(`hashAmounts: `, toHex(hashAmounts))

      // 3. hashScriptPubKeys = sha256(scriptPubKeySize0 + scriptPubKey0 + scriptPubKeySize1 + scriptPubKey1 + ...)
      const allScriptPubKeys = utxos.reduce((acc, utxo) => {
        const scriptPubKeySize = decimalToCompactHex(utxo.script.length / 2)
        return acc + scriptPubKeySize + utxo.script
      }, '')
      console.log(`allScriptPubKeys: `, allScriptPubKeys)
      const hashScriptPubKeys = sha256(Buffer.from(allScriptPubKeys, 'hex'))
      console.log(`hashScriptPubKeys: `, toHex(hashScriptPubKeys))

      // 4. hashSequence = sha256(sequence0 + sequence1 + ...)
      const sequences = tx.ins.reduce((acc, input) => {
        const sequence = decimalToFixedByteHex(Number(input.sequence), 4, true)
        return acc + sequence
      }, '')
      const hashSequence = sha256(Buffer.from(sequences, 'hex'))
      console.log(`hashSequence: `, toHex(hashSequence))

      // 5. hashOutputs = sha256(amount0 + scriptPubKeySize0 + scriptPubKey0 + amount1 + scriptPubKeySize1 + scriptPubKey1 + ...)

      const amountsAndScriptPubKeys = tx.outs.reduce((acc, output) => {
        const amount = decimalToFixedByteHex(Number(output.value), 8, true)
        const scriptPubKeySize = decimalToCompactHex(output.script.length)
        const scriptPubKey = toHex(output.script)
        return acc + amount + scriptPubKeySize + scriptPubKey
      }, '')
      console.log(`amountsAndScriptPubKeys: `, amountsAndScriptPubKeys)
      const hashOutputs = sha256(Buffer.from(amountsAndScriptPubKeys, 'hex'))

      console.log(`hashOutputs: `, toHex(hashOutputs))

      // 6. 拼接
      const version = Buffer.from(
        decimalToFixedByteHex(tx.version, 4, true),
        'hex'
      )
      const lockTime = Buffer.from(
        decimalToFixedByteHex(Number(tx.locktime), 4, true),
        'hex'
      )
      const inIndex = Buffer.from(
        decimalToFixedByteHex(signInputIndex, 4, true),
        'hex'
      )

      const leafHash = null
      const annex = null

      const spendType = Buffer.from(
        ((leafHash ? 2 : 0) + (annex ? 1 : 0)).toString(16).padStart(2, '0'),
        'hex'
      )

      console.log(`spendType: `, spendType)
      const hashType = Buffer.from('00', 'hex')

      const sigMsg = Buffer.concat([
        hashType,
        version,
        lockTime,
        hashPrevouts,
        hashAmounts,
        hashScriptPubKeys,
        hashSequence,
        hashOutputs,
        spendType,
        inIndex // if isAnyoneCanPay = true, replace to Input hash + vout + value + scriptPubKey + sequence
      ])

      console.log(`sigMsg: `, toHex(sigMsg))

      const tapKeyHash = taggedHash(
        'TapSighash',
        Buffer.concat([Uint8Array.from([0x00]), sigMsg])
      )

      console.log(`tapKeyHash: `, toHex(tapKeyHash))

      const tweakedSigner = tweakSigner(keypair)
      const signature =
        tweakedSigner.signSchnorr && tweakedSigner.signSchnorr(tapKeyHash)
      console.log(`signature: `, toHex(signature!))
    } else if (utxo.type === 'P2WPKH') {
      // 1. hashPrevouts = hash256(txid0 + vout0 + txid1 + vout1 + ...)
      const txidAndVouts = tx.ins.reduce((acc, input) => {
        const txid = toHex(input.hash)
        const vout = decimalToFixedByteHex(Number(input.index), 4, true)

        return acc + txid + vout
      }, '')
      const hashPrevouts = hash256(Buffer.from(txidAndVouts, 'hex'))

      // 2. hashSequence = hash256(sequence0 + sequence1 + ...)
      const sequences = tx.ins.reduce((acc, input) => {
        const sequence = decimalToFixedByteHex(Number(input.sequence), 4, true)
        return acc + sequence
      }, '')
      const hashSequence = hash256(Buffer.from(sequences, 'hex'))

      // 3. hashOutputs = hash256(amount0 + scriptPubKeySize0 + scriptPubKey0 + amount1 + scriptPubKeySize1 + scriptPubKey1 + ...)
      const amountsAndScriptPubKeys = tx.outs.reduce((acc, output) => {
        const amount = decimalToFixedByteHex(Number(output.value), 8, true)
        const scriptPubKeySize = decimalToCompactHex(output.script.length)
        const scriptPubKey = toHex(output.script)
        return acc + amount + scriptPubKeySize + scriptPubKey
      }, '')
      console.log(`amountsAndScriptPubKeys: `, amountsAndScriptPubKeys)
      const hashOutputs = hash256(Buffer.from(amountsAndScriptPubKeys, 'hex'))

      const version = Buffer.from(
        decimalToFixedByteHex(tx.version, 4, true),
        'hex'
      )
      const lockTime = Buffer.from(
        decimalToFixedByteHex(Number(tx.locktime), 4, true),
        'hex'
      )

      const vout = Buffer.from(
        decimalToFixedByteHex(Number(input.index), 4, true),
        'hex'
      )
      const amount = Buffer.from(
        decimalToFixedByteHex(Number(utxo.amount), 8, true),
        'hex'
      )

      const prevOut = payments.p2pkh({
        hash: Buffer.from(utxo.script, 'hex').subarray(2)
      }).output!
      const prevOutSize = Buffer.from(
        decimalToCompactHex(prevOut.length),
        'hex'
      )
      const sequence = Buffer.from(
        decimalToFixedByteHex(Number(input.sequence), 4, true),
        'hex'
      )

      const sigMsg = Buffer.concat([
        version,
        hashPrevouts,
        hashSequence,
        input.hash,
        vout,
        prevOutSize,
        prevOut,
        amount,
        sequence,
        hashOutputs,
        lockTime,
        Buffer.from('01000000', 'hex')
      ])

      const hash = hash256(sigMsg)

      console.log(`hash: `, toHex(hash))
      // ecdsa 签名
      const ecdsaSignature = keypair.sign(hash)
      setEcdsaSignature(toHex(ecdsaSignature))

      // Der 编码
      const derSignature = script.signature.encode(ecdsaSignature, 0x01)
      setDerSignature(toHex(derSignature))
    } else {
      tx.ins[signInputIndex].script = Buffer.from(utxo.script, 'hex')
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
