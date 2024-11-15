'use client'
import { networks, payments, script, Stack } from 'bitcoinjs-lib'
import { OPS } from 'bitcoinjs-lib/src/ops'
import { useMemo, useState } from 'react'
import CodeBlock from '../code-block'
import InteractionCard from '../interaction-card'
import { Input } from '../ui/input'

export default function Brc20Pub() {
  const [internalPubKey, setInternalPubKey] = useState(
    '386d02d92ce3ccae0beabe10ceaa8d6b2f70f33952c914bde17928c0c905a367'
  )
  const [address, setAddress] = useState('')

  const x = script.decompile(
    Buffer.from(
      '208277ff85042937da67943320113d937289bacee7bc94760e1fe54e8ee262e028ac0063036f7264010118746578742f706c61696e3b636861727365743d7574662d3800337b2270223a226272632d3230222c226f70223a226d696e74222c227469636b223a2273617473222c22616d74223a223130227d68',
      'hex'
    )
  )
  console.log(x)

  // pri: f939455d7c77d62aee3b9ed2883a6b2159b48d280c65284558422056e3b19358
  // internalPub: 386d02d92ce3ccae0beabe10ceaa8d6b2f70f33952c914bde17928c0c905a367
  // ordinals taproot address: tb1pk2nrlts47mervjvt0dhalqt0774laj0zhe99x8pfja443s7wth3s6dthwd

  useMemo(() => {
    const inscriptionData = {
      contentType: 'text/plain;charset=utf-8',
      body: `{"p":"brc-20","op":"mint","tick":"sats","amt":"10"}`
    }

    let inscriptionBuilder: Stack = []

    inscriptionBuilder.push(Buffer.from(internalPubKey, 'hex'))
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

    console.log(`inscriptionScript: ${inscriptionScript.toString('hex')}`)

    const scriptTree = {
      output: inscriptionScript
    }

    console.log('internalPubKey: ', internalPubKey)
    console.log('scriptTree:', scriptTree.output.toString('hex'))

    const redeem = {
      output: inscriptionScript,
      redeemVersion: 0xc0
    }

    const { output, witness, hash, address } = payments.p2tr({
      internalPubkey: Buffer.from(internalPubKey, 'hex'),
      scriptTree,
      redeem,
      network: networks.testnet
    })

    console.log('output:', output!.toString('hex'))

    console.log(address)
    setAddress(address || '')
  }, [internalPubKey])

  return (
    <InteractionCard title='taproot 地址'>
      <Input
        placeholder='请输入内部公钥'
        value={internalPubKey}
        onChange={(e) => setInternalPubKey(e.target.value)}
      />

      <div>地址：{address}</div>

      <CodeBlock
        code={`OP_PUSHBYTES_32 ${internalPubKey} \nOP_CHECKSIG \nOP_0 \nOP_IF \n OP_PUSHBYTES_3 ord \n OP_PUSHBYTES_1 01 \n OP_PUSHBYTES_24 text/plain;charset=utf-8 \n OP_0 \n OP_PUSHBYTES_51 {"p":"brc-20","op":"mint","tick":"sats","amt":"10"} \nOP_ENDIF`}
        language='shell'
      ></CodeBlock>
    </InteractionCard>
  )
}
