'use client'
import ECPair from '@/lib/blockchain/ecpair'
import { NETWORKS } from '@/lib/constants'
import { payments, script, Stack } from 'bitcoinjs-lib'
import { OPS } from 'bitcoinjs-lib/src/ops'
import { ECPairInterface } from 'ecpair'
import { useEffect, useMemo, useState } from 'react'
import CodeBlock from '../code-block'
import ContentCard from '../content-card'
import InteractionCard from '../interaction-card'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import PublicKeyViewer from './public-key-viewer'

export default function Brc20Pub() {
  const [network, setNetwork] = useState<keyof typeof NETWORKS>('testnet')

  const [internalPair, setInternalPair] = useState<ECPairInterface | undefined>(
    undefined
  )

  const [internalPubKey, setInternalPubKey] = useState<Buffer>(Buffer.alloc(0))
  const [inscriptionScript, setInscriptionScript] = useState('')

  const [taprootPubKey, setTaprootPubKey] = useState('')
  const [commitToAddress, setCommitToAddress] = useState('')

  useEffect(() => {
    generateRandomPair()
  }, [])

  const generateRandomPair = () => {
    const pair = ECPair.makeRandom({
      network: NETWORKS[network].network,
      compressed: false
    })
    setInternalPair(pair)

    if (pair.publicKey) setInternalPubKey(pair.publicKey.subarray(1, 33))
  }

  useMemo(() => {
    if (!internalPair || !internalPair.publicKey) return
    const inscriptionData = {
      contentType: 'text/plain;charset=utf-8',
      body: `{"p":"brc-20","op":"mint","tick":"sats","amt":"10"}`
    }

    const internalPubKey = internalPair.publicKey.subarray(1, 33)
    let inscriptionBuilder: Stack = []

    inscriptionBuilder.push(internalPubKey)
    inscriptionBuilder.push(OPS.OP_CHECKSIG)
    inscriptionBuilder.push(OPS.OP_0)
    inscriptionBuilder.push(OPS.OP_IF)
    inscriptionBuilder.push(Buffer.from('ord'))
    inscriptionBuilder.push(0x01)
    inscriptionBuilder.push(0x01)
    inscriptionBuilder.push(Buffer.from(inscriptionData.contentType))
    inscriptionBuilder.push(OPS.OP_0)

    const maxChunkSize = 520
    let body = Buffer.from(inscriptionData.body)
    let bodySize = body.length
    for (let i = 0; i < bodySize; i += maxChunkSize) {
      let end = i + maxChunkSize
      if (end > bodySize) {
        end = bodySize
      }
      inscriptionBuilder.push(body.subarray(i, end))
    }
    inscriptionBuilder.push(OPS.OP_ENDIF)

    const inscriptionScript = script.compile(inscriptionBuilder)

    setInscriptionScript(inscriptionScript.toString('hex'))

    const scriptTree = {
      output: inscriptionScript
    }

    const redeem = {
      output: inscriptionScript,
      redeemVersion: 0xc0
    }

    const { output, witness, hash, address } = payments.p2tr({
      internalPubkey: internalPubKey,
      scriptTree,
      redeem,
      network: NETWORKS[network].network
    })

    console.log('output:', output!.toString('hex'))

    setCommitToAddress(address!)

    setTaprootPubKey(output?.subarray(2, 34).toString('hex') || '')
  }, [internalPair, network])

  return (
    <InteractionCard title='计算 Commit 地址'>
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
              id={`unsignature_${key}`}
            />
            <Label htmlFor={`unsignature_${key}`}>
              {NETWORKS[key as keyof typeof NETWORKS].label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <ContentCard
        title={
          <div className='font-medium flex items-center gap-x-2'>
            <Button
              size={'sm'}
              onClick={generateRandomPair}
            >
              生成随机内部密钥对
            </Button>
          </div>
        }
      >
        <ContentCard
          title='内部私钥'
          content={internalPair?.privateKey?.toString('hex')}
        />
        <ContentCard title='内部公钥'>
          <PublicKeyViewer
            publicKey={
              (internalPair && internalPair.publicKey.toString('hex')) || ''
            }
          />
        </ContentCard>
      </ContentCard>

      <ContentCard title='花费脚本明文'>
        <CodeBlock
          code={`OP_PUSHBYTES_32 ${internalPubKey.toString('hex')} \nOP_CHECKSIG \nOP_0 \nOP_IF \n OP_PUSHBYTES_3 ord \n OP_PUSHBYTES_1 01 \n OP_PUSHBYTES_24 text/plain;charset=utf-8 \n OP_0 \n OP_PUSHBYTES_51 {"p":"brc-20","op":"mint","tick":"sats","amt":"10"} \nOP_ENDIF`}
          language='shell'
        />
      </ContentCard>

      <ContentCard
        title='花费脚本16进制'
        content={inscriptionScript}
      />

      <ContentCard
        title='Taproot 公钥'
        content={taprootPubKey}
      />

      <ContentCard
        title='Taproot 地址'
        content={commitToAddress}
      />
    </InteractionCard>
  )
}
