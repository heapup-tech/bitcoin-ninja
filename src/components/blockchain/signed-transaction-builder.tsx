'use client'

import { decimalToFixedByteHex } from '@/lib/blockchain/bytes'
import ECPair from '@/lib/blockchain/ecpair'
import { getScriptType } from '@/lib/blockchain/script-utils'
import {
  sigMsgForSignature,
  sigMsgForWitnessV0,
  sigMsgForWitnessV1
} from '@/lib/blockchain/signature'
import { tweakSigner } from '@/lib/blockchain/taproot-signature'
import { NETWORKS, SIGHASHES } from '@/lib/constants'
import { script, Transaction } from 'bitcoinjs-lib'
import { hash256, taggedHash } from 'bitcoinjs-lib/src/crypto'
import { useEffect, useState } from 'react'
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
import TransactionSplitTab from './transaction-split-tab'

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

  const [hashedSigMessage, setHashedSigMessage] = useState('')
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

    const keypair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))

    const tx = unsignedTransaction.clone()

    const input = tx.ins[signInputIndex]
    const utxo = utxos[signInputIndex]
    const sigHashValue = SIGHASHES[inputSigHashes[signInputIndex]].value
    if (utxo.type === 'P2TR') {
      let { sigMsg } = sigMsgForWitnessV1(
        tx,
        signInputIndex,
        utxos,
        sigHashValue
      )
      console.log(`sigMsg: `, toHex(sigMsg))

      sigMsg = Buffer.concat([Buffer.from([sigHashValue]), sigMsg])

      console.log(`sigMsg: `, toHex(sigMsg))

      const tapKeyHash = taggedHash(
        'TapSighash',
        Buffer.concat([Buffer.from([0x00]), sigMsg])
      )

      console.log(`tapKeyHash: `, toHex(tapKeyHash))
      // setHashedSigMessage(toHex(tapKeyHash))

      const tweakedSigner = tweakSigner(keypair, NETWORKS[network].network)
      const signature =
        tweakedSigner.signSchnorr && tweakedSigner.signSchnorr(tapKeyHash)

      // Serializes a taproot signature.
      const taprootSignature = Buffer.concat([
        signature!,
        (sigHashValue !== 0 && Buffer.from([sigHashValue])) || Buffer.from([])
      ])

      console.log(`signature: `, toHex(taprootSignature))
    } else if (utxo.type === 'P2WPKH' || utxo.type === 'P2WSH') {
      const { sigMsg } = sigMsgForWitnessV0(
        tx,
        signInputIndex,
        utxo,
        sigHashValue
      )

      const sigHashBuffer = Buffer.from(
        decimalToFixedByteHex(sigHashValue, 4, true),
        'hex'
      )

      const sigMsgBuffer = Buffer.concat([sigMsg, sigHashBuffer])
      console.log(`sigMsgBuffer: `, toHex(sigMsgBuffer))

      const hash = hash256(sigMsgBuffer)
      setHashedSigMessage(toHex(hash))
      console.log(`hash: `, toHex(hash))
      // ecdsa 签名
      const ecdsaSignature = keypair.sign(hash)
      setEcdsaSignature(toHex(ecdsaSignature))

      // Der 编码
      const derSignature = script.signature.encode(ecdsaSignature, sigHashValue)
      setDerSignature(toHex(derSignature))
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

      // hash256
      const hashedTransaction = hash256(Buffer.from(waitingForSignTx, 'hex'))
      setHashedSigMessage(toHex(hashedTransaction))

      // ecdsa 签名
      const ecdsaSignature = keypair.sign(hashedTransaction)
      setEcdsaSignature(toHex(ecdsaSignature))

      // Der 编码
      const derSignature = script.signature.encode(ecdsaSignature, sigHashValue)
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

              <div className='mt-4'>
                <Label className='relative mb-3'>签名数据</Label>
                <TransactionSplitTab
                  hex={unsignedTransactionForInput?.toHex()}
                  className='mt-0.5'
                />
              </div>
              <ContentCard
                title='Hash256'
                content={hashedSigMessage}
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
