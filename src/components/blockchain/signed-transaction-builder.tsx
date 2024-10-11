'use client'

import { decimalToFixedByteHex } from '@/lib/blockchain/bytes'
import { getScriptType } from '@/lib/blockchain/script-utils'
import {
  sigMsgForSignature,
  sigMsgForWitnessV0,
  sigMsgForWitnessV1
} from '@/lib/blockchain/signature'
import { NETWORKS, SIGHASHES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { isValidPrivateKey } from '@/lib/validator'
import { Transaction } from 'bitcoinjs-lib'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { toHex } from 'uint8array-tools'
import ContentCard from '../content-card'
import InteractionCard from '../interaction-card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Textarea } from '../ui/textarea'
import NoWitnessSignature from './no-witness-signature'
import WitnessV0Signature from './witness-v0-signature'
import WitnessV1Signature from './witness-v1-signature'

interface SignTransactionProps {
  hex: string // unsigned transaction hex
}

export default function SignedTransactionBuilder({
  hex
}: SignTransactionProps) {
  const [network, setNetwork] = useState<keyof typeof NETWORKS>('testnet')

  const [privateKey, setPrivateKey] = useState(
    '585d4bc6533320c1586cb4c4831818a4e418d1f7d0e2a5313169e65a450f7b9d'
  )
  const [validPrivateKey, setValidPrivateKey] = useState(privateKey)

  const [unsignedRawTransaction, setUnsignedRawTransaction] = useState(
    hex ||
      '02000000030323f0c5cdd3408336cd7e6b6df9cf0ccde996f363b64a066497a5a60c44f7e40000000000ffffffffcd048bf2054b6885f29246ed1ae55c0e329ed3f0ccaa2d597c6b99b0ed3b97160000000000ffffffff161ec3f56a53829f31665ae94c3d1dee3d4a6b5f1096c0a9f84ce46db70c36770000000000ffffffff016400000000000000225120b2049a6d884575fe95e3fcaeaedae4ec4feaecccc30fad156f12923753c0954e00000000'
  )
  const [utxos, setUtxos] = useState<UTXO[]>([
    {
      script: '76a914c189d7f7ea4333daec66a645cb3388163c22900b88ac',
      type: 'P2PKH',
      amount: '100000'
    },
    {
      script: '0014c189d7f7ea4333daec66a645cb3388163c22900b',
      type: 'P2WPKH',
      amount: '20000'
    },
    {
      script:
        '5120b2049a6d884575fe95e3fcaeaedae4ec4feaecccc30fad156f12923753c0954e',
      type: 'P2TR',
      amount: '500000'
    }
  ])

  const [inputSigHashes, setInputSigHashes] = useState<
    (keyof typeof SIGHASHES)[]
  >(['all', 'all', 'default'])

  const [unsignedTransaction, setUnsignedTransaction] = useState<Transaction>()
  const [signInputIndex, setSignInputIndex] = useState(2)

  // 特定输入的未签名交易
  const [unsignedTransactionForInput, setUnsignedTransactionForInput] =
    useState<Transaction>()
  const [witnessV0Msg, setWitnessV0Msg] = useState<
    WitnessV0Message | undefined
  >(undefined)

  const [witnessV1Msg, setWitnessV1Msg] = useState<
    WitnessV1Message | undefined
  >(undefined)

  useEffect(() => {
    if (!unsignedRawTransaction || !privateKey) return

    if (isValidPrivateKey(privateKey)) {
      try {
        setValidPrivateKey(privateKey)
        setUnsignedTransaction(Transaction.fromHex(unsignedRawTransaction))
      } catch (error) {}
    }
  }, [unsignedRawTransaction, privateKey])

  useEffect(() => {
    if (!unsignedTransaction) return

    if (unsignedTransaction.ins.length > utxos.length) {
      const newUtxos = [...utxos]
      for (let i = utxos.length; i < unsignedTransaction.ins.length; i++) {
        newUtxos.push({
          script: '',
          amount: '0',
          type: 'UNKNOWN'
        })
      }
      setUtxos(newUtxos)
    } else if (unsignedTransaction.ins.length < utxos.length) {
      const newUtxos = utxos.slice(0, unsignedTransaction.ins.length)
      setUtxos(newUtxos)
    }

    signTx()
  }, [unsignedTransaction, signInputIndex, utxos, network, inputSigHashes])

  const signTx = () => {
    if (!unsignedTransaction) return
    const tx = unsignedTransaction.clone()

    const utxo = utxos[signInputIndex]
    const sigHashValue = SIGHASHES[inputSigHashes[signInputIndex]].value
    if (utxo.type === 'P2TR') {
      let witnessV1Msg = sigMsgForWitnessV1(
        tx,
        signInputIndex,
        utxos,
        sigHashValue
      )
      let witnessV1MsgStr: Record<keyof WitnessV1Message, string> = {
        sigMsg: '',
        version: '',
        lockTime: '',
        hashPrevouts: '',
        hashAmounts: '',
        hashScriptPubKeys: '',
        hashSequences: '',
        hashOutputs: '',
        spendType: '',
        inputHash: '',
        vout: '',
        value: '',
        scriptPubKeySize: '',
        scriptPubKey: '',
        sequence: '',
        inIndex: ''
      }
      Object.keys(witnessV1Msg).forEach((key) => {
        const typedKey = key as keyof WitnessV1Message
        witnessV1MsgStr[typedKey] = toHex((witnessV1Msg as any)[typedKey])
      })
      setWitnessV1Msg(witnessV1MsgStr)
    } else if (utxo.type === 'P2WPKH' || utxo.type === 'P2WSH') {
      const witnessV0Msg = sigMsgForWitnessV0(
        tx,
        signInputIndex,
        utxo,
        sigHashValue
      )

      let witnessV0MsgStr: Record<keyof WitnessV0Message, string> = {
        sigMsg: '',
        version: '',
        hashPrevouts: '',
        hashSequence: '',
        inputHash: '',
        vout: '',
        prevOutSize: '',
        prevOut: '',
        amount: '',
        sequence: '',
        hashOutputs: '',
        lockTime: ''
      }
      Object.keys(witnessV0Msg).forEach((key) => {
        const typedKey = key as keyof WitnessV0Message
        witnessV0MsgStr[typedKey] = toHex((witnessV0Msg as any)[typedKey])
      })
      setWitnessV0Msg(witnessV0MsgStr)
    } else {
      const txTemp = sigMsgForSignature(
        tx,
        signInputIndex,
        utxos[signInputIndex],
        sigHashValue
      )

      const hashTypeHex = decimalToFixedByteHex(sigHashValue, 4, true)

      const waitingForSignTx = txTemp.toHex() + hashTypeHex
      console.log(`waitingForSignTx: `, waitingForSignTx)

      setUnsignedTransactionForInput(txTemp)
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
          className={cn(
            'bg-background',
            !isValidPrivateKey(privateKey) && 'bg-red-200'
          )}
          type='text'
          value={privateKey}
          onChange={(e) => {
            setPrivateKey(e.target.value)
          }}
        />
      </ContentCard>

      <RadioGroup
        className='flex mt-4'
        value={network}
        onValueChange={(v: keyof typeof NETWORKS) => setNetwork(v)}
      >
        {Object.keys(NETWORKS).map((key) => (
          <div
            className='flex items-center space-x-2'
            key={key}
          >
            <RadioGroupItem
              value={key}
              id={`signature_${key}`}
            />
            <Label htmlFor={`signature_${key}`}>
              {NETWORKS[key as keyof typeof NETWORKS].label}
            </Label>
          </div>
        ))}
      </RadioGroup>

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
                    className='bg-background w-40'
                    placeholder='Amount'
                    value={utxos[index].amount}
                    type='number'
                    onChange={(e) => {
                      const newUtxos = [...utxos]
                      newUtxos[index].amount = e.target.value
                      setUtxos(newUtxos)
                    }}
                  />
                </div>
              </ContentCard>

              <ContentCard title='签名哈希类型'>
                <Select
                  value={inputSigHashes[index]}
                  onValueChange={(v: keyof typeof SIGHASHES) => {
                    if (utxos[index].type !== 'P2TR' && v === 'default') {
                      return toast.error('非 P2TR 不能选择 SIGHASH_DEFAULT')
                    }
                    const newInputSigHashes = [...inputSigHashes]
                    newInputSigHashes[index] = v
                    setInputSigHashes(newInputSigHashes)
                  }}
                >
                  <SelectTrigger className='bg-background'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SIGHASHES).map((key) => (
                      <SelectItem
                        key={key}
                        value={key}
                      >
                        {SIGHASHES[key as keyof typeof SIGHASHES].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ContentCard>
              {(utxos[index].type === 'P2PKH' ||
                utxos[index].type === 'P2SH') && (
                <NoWitnessSignature
                  unsignedTransactionForInput={unsignedTransactionForInput}
                  privateKey={validPrivateKey}
                  sigHash={SIGHASHES[inputSigHashes[signInputIndex]].value}
                />
              )}

              {(utxos[index].type === 'P2WPKH' ||
                utxos[index].type === 'P2WSH') && (
                <WitnessV0Signature
                  witnessV0Msg={witnessV0Msg}
                  privateKey={validPrivateKey}
                  sigHash={SIGHASHES[inputSigHashes[signInputIndex]].value}
                />
              )}

              {utxos[index].type === 'P2TR' && (
                <WitnessV1Signature
                  witnessV1Msg={witnessV1Msg}
                  privateKey={validPrivateKey}
                  sigHash={SIGHASHES[inputSigHashes[signInputIndex]].value}
                  network={network}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </InteractionCard>
  )
}
