'use client'

import {
  decimalToCompactHex,
  decimalToFixedByteHex
} from '@/lib/blockchain/bytes'
import { networks } from 'bitcoinjs-lib'
import { toOutputScript } from 'bitcoinjs-lib/src/address'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { toHex } from 'uint8array-tools'
import InteractionCard from '../interaction-card'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import TransactionSplitTab from './transaction-split-tab'

export default function UnSignTransactionBuilder() {
  const [version, setVersion] = useState('01000000')
  const [isSegwit, setIsSegwit] = useState(false)
  const [inputs, setInputs] = useState<
    Array<
      TransactionInput & {
        scriptPubKey: string
      }
    >
  >([
    {
      txid: 'e4f7440ca6a59764064ab663f396e9cd0ccff96d6b7ecd368340d3cdc5f02303',
      vout: '0',
      sequence: 'ffffffff',
      scriptSigSize: '00',
      scriptSig: '',
      scriptPubKey: '76a914c189d7f7ea4333daec66a645cb3388163c22900b88ac'
    },
    {
      txid: 'eea092f5d411a7d35344a21b3e7735dac8e5a804af44fc8b02594f4d80d0cf24',
      vout: '0',
      sequence: 'ffffffff',
      scriptSigSize: '00',
      scriptSig: '',
      scriptPubKey: '76a914c189d7f7ea4333daec66a645cb3388163c22900b88ac'
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
    }
  ])

  const [rawTransaction, setRawTransaction] = useState('')

  useEffect(() => {
    if (isSegwit) setVersion('02000000')
    buildTransaction()
  }, [isSegwit, version, inputs, outputs])

  useEffect(() => {
    buildTransaction()
  }, [])

  const buildTransaction = () => {
    let rawTransaction = ''

    rawTransaction += version

    if (isSegwit) {
      rawTransaction += '0001'
    }
    rawTransaction += decimalToCompactHex(inputs.length)
    inputs.forEach((input) => {
      // txid
      rawTransaction += toHex(
        Uint8Array.from(Buffer.from(input.txid, 'hex')).reverse()
      )
      // vout
      rawTransaction += decimalToFixedByteHex(Number(input.vout), 4, true)
      // scriptSigSize
      rawTransaction += decimalToCompactHex(input.scriptPubKey.length / 2)
      // scriptSig
      rawTransaction += input.scriptPubKey
      // sequence
      rawTransaction += input.sequence
    })

    rawTransaction += decimalToCompactHex(outputs.length)

    try {
      outputs.forEach((output) => {
        // amount
        rawTransaction += decimalToFixedByteHex(Number(output.amount), 8, true)

        let script: Buffer = Buffer.from('')
        if (output.recipient) {
          script = toOutputScript(output.recipient, networks.testnet)
        }

        // scriptPubKeySize
        rawTransaction += decimalToCompactHex(script.length)

        // scriptPubKey
        rawTransaction += toHex(script)
      })
    } catch (error) {}

    if (isSegwit) {
      inputs.forEach(() => {
        rawTransaction += '00'
      })
    }

    rawTransaction += '00000000'

    setRawTransaction(rawTransaction)
  }

  return (
    <InteractionCard title='未签名交易构造器'>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='tx_type'
          checked={isSegwit}
          onCheckedChange={(checked: boolean) => setIsSegwit(checked)}
        />
        <Label htmlFor='tx_type'>隔离见证交易</Label>
      </div>

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
            <SelectItem value='01000000'>0x00000001</SelectItem>
            <SelectItem value='02000000'>0x00000002</SelectItem>
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
                  scriptSig: '',
                  scriptPubKey: ''
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

                <Textarea
                  className='bg-background mt-2'
                  placeholder='ScriptPubKey'
                  value={input.scriptPubKey}
                  onChange={(e) => {
                    const newInputs = [...inputs]
                    newInputs[index].scriptPubKey = e.target.value
                    setInputs(newInputs)
                  }}
                />
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
