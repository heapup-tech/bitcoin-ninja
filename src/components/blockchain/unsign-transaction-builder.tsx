'use client'

import { NETWORKS } from '@/lib/constants'
import { Transaction } from 'bitcoinjs-lib'
import { toOutputScript } from 'bitcoinjs-lib/src/address'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import InteractionCard from '../interaction-card'
import { Button } from '../ui/button'
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
import TransactionSplitTab from './transaction-split-tab'

export default function UnSignTransactionBuilder() {
  const [network, setNetwork] = useState<keyof typeof NETWORKS>('testnet')

  const [version, setVersion] = useState('2')
  const [inputs, setInputs] = useState<Array<TransactionInput>>([
    {
      txid: 'e4f7440ca6a59764064ab663f396e9cd0ccff96d6b7ecd368340d3cdc5f02303',
      vout: '0',
      sequence: 'ffffffff',
      scriptSigSize: '00',
      scriptSig: ''
    },
    {
      txid: '16973bedb0996b7c592daaccf0d39e320e5ce51aed4692f285684b05f28b04cd',
      vout: '0',
      sequence: 'ffffffff',
      scriptSigSize: '00',
      scriptSig: ''
    },
    {
      txid: '77360cb76de44cf8a9c096105f6b4a3dee1d3d4ce95a66319f82536af5c31e16',
      vout: '0',
      sequence: 'ffffffff',
      scriptSigSize: '00',
      scriptSig: ''
    }
  ])

  const [outputs, setOutputs] = useState<
    Array<
      TransactionOutput & {
        recipient: string
      }
    >
  >([
    {
      amount: '100',
      scriptPubKeySize: '0',
      scriptPubKey: 'ffffffff',
      recipient:
        'tb1pkgzf5mvgg46la90rljh2akhya3874mxvcv8669t0z2frw57qj48qa5x5y6'
    },
    {
      amount: '500',
      scriptPubKeySize: '0',
      scriptPubKey: 'ffffffff',
      recipient: 'tb1qxrm7leyx9mlmpakygy68upjn6uqny8awzps3w6'
    }
  ])

  const [rawTransaction, setRawTransaction] = useState('')

  useEffect(() => {
    buildTransaction()
  }, [version, inputs, outputs, network])

  useEffect(() => {
    buildTransaction()
  }, [])

  const buildTransaction = () => {
    const tx = new Transaction()

    tx.version = Number(version)

    inputs.forEach((input) => {
      tx.addInput(Buffer.from(input.txid, 'hex').reverse(), Number(input.vout))
    })

    try {
      outputs.forEach((output) => {
        let script: Buffer = Buffer.from('')
        if (output.recipient) {
          script = toOutputScript(output.recipient, NETWORKS[network].network)
        }
        tx.addOutput(script, Number(output.amount))
      })
    } catch (error: any) {
      console.log(error)

      toast.error((error && error.message) || '构造交易失败')
    }

    // rawTransaction += version

    // rawTransaction += decimalToCompactHex(inputs.length)
    // inputs.forEach((input) => {
    //   // txid
    //   rawTransaction += toHex(
    //     Uint8Array.from(Buffer.from(input.txid, 'hex')).reverse()
    //   )
    //   // vout
    //   rawTransaction += decimalToFixedByteHex(Number(input.vout), 4, true)
    //   // scriptSigSize
    //   rawTransaction += '00'
    //   // // scriptSig
    //   // rawTransaction += input.scriptPubKey
    //   // sequence
    //   rawTransaction += input.sequence
    // })

    // rawTransaction += decimalToCompactHex(outputs.length)

    // rawTransaction += '00000000'

    setRawTransaction(tx.toHex())
  }

  return (
    <InteractionCard title='未签名交易构造器'>
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

      <div className='mt-4'>
        <Label htmlFor='tx_version'>版本</Label>
        <Select
          value={version}
          onValueChange={setVersion}
        >
          <SelectTrigger className='bg-background'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1'>0x00000001</SelectItem>
            <SelectItem value='2'>0x00000002</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='mt-4'>
        <Label
          htmlFor='tx_version'
          className='flex items-center mb-1'
        >
          <span>交易输入</span>
          <Button
            size='sm'
            className='p-0 h-auto ml-2 text-primary'
            variant='ghost'
            onClick={() => {
              setInputs([
                ...inputs,
                {
                  txid: '',
                  vout: '0',
                  sequence: 'ffffffff',
                  scriptSigSize: '00',
                  scriptSig: ''
                }
              ])
            }}
          >
            <CirclePlus size={18} />
          </Button>
        </Label>

        <div className='flex-col space-y-2'>
          {inputs.map((input, index) => (
            <div
              key={input.txid + index}
              className='flex items-center space-x-2 border p-2 rounded-lg bg-background'
            >
              <div className='flex flex-col flex-1'>
                <div className='flex items-center gap-x-4'>
                  <Input
                    className='bg-background'
                    placeholder='交易ID'
                    value={input.txid}
                    onChange={(e) => {
                      const newInputs = [...inputs]
                      newInputs[index].txid = e.target.value
                      setInputs(newInputs)
                    }}
                  />
                  <Input
                    className='bg-background w-40'
                    placeholder='输出索引'
                    type='number'
                    value={input.vout}
                    onChange={(e) => {
                      const newInputs = [...inputs]
                      newInputs[index].vout = e.target.value
                      setInputs(newInputs)
                    }}
                  />
                </div>
              </div>

              <Button
                size='sm'
                className='p-0 h-auto ml-2 text-primary'
                variant='ghost'
                onClick={() => {
                  if (inputs.length === 1) {
                    toast.error('至少保留一个输入')
                  } else {
                    setInputs(inputs.filter((_, i) => i !== index))
                  }
                }}
              >
                <CircleMinus size={18} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-4'>
        <Label
          htmlFor='tx_version'
          className='flex items-center mb-1'
        >
          <span>交易输出</span>
          <Button
            size='sm'
            className='p-0 h-auto ml-2 text-primary'
            variant='ghost'
            onClick={() => {
              setOutputs([
                ...outputs,
                {
                  amount: '',
                  scriptPubKeySize: '',
                  scriptPubKey: '',
                  recipient: ''
                }
              ])
            }}
          >
            <CirclePlus size={18} />
          </Button>
        </Label>

        <div className='flex-col space-y-2'>
          {outputs.map((output, index) => (
            <div
              key={output.recipient + index}
              className='flex items-center space-x-2'
            >
              <Input
                className='bg-background'
                placeholder='接收地址'
                value={output.recipient}
                onChange={(e) => {
                  const newOutputs = [...outputs]
                  newOutputs[index].recipient = e.target.value
                  setOutputs(newOutputs)
                }}
              ></Input>
              <Input
                className='bg-background w-40'
                placeholder='输出金额(聪)'
                value={output.amount}
                type='number'
                onChange={(e) => {
                  const newOutputs = [...outputs]
                  newOutputs[index].amount = e.target.value
                  setOutputs(newOutputs)
                }}
              />

              <Button
                size='sm'
                className='p-0 h-auto ml-2 text-primary'
                variant='ghost'
                onClick={() => {
                  if (outputs.length === 1) {
                    toast.error('至少保留一个输出')
                  } else {
                    setOutputs(outputs.filter((_, i) => i !== index))
                  }
                }}
              >
                <CircleMinus size={18} />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <TransactionSplitTab hex={rawTransaction} />
    </InteractionCard>
  )
}
