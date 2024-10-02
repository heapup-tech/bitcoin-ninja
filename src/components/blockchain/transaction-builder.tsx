'use client'

import {
  decimalToCompactHex,
  decimalToFixedByteHex
} from '@/lib/blockchain/bytes'
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
import TransactionSplitTab from './transaction-split-tab'

export default function TransactionBuilder() {
  const [version, setVersion] = useState('01000000')
  const [isSegwit, setIsSegwit] = useState(false)
  const [inputs, setInputs] = useState<TransactionInput[]>([
    {
      txid: 'e4f7440ca6a59764064ab663f396e9cd0ccff96d6b7ecd368340d3cdc5f02303',
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
  >([])

  const [rawTransaction, setRawTransaction] = useState('')

  useEffect(() => {
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
      rawTransaction += toHex(
        Uint8Array.from(Buffer.from(input.txid, 'hex')).reverse()
      )
      rawTransaction += decimalToFixedByteHex(Number(input.vout), 4, true)
      rawTransaction += decimalToCompactHex(input.scriptSig.length / 2)
      rawTransaction += input.scriptSig
      rawTransaction += input.sequence
    })

    rawTransaction += decimalToCompactHex(outputs.length)
    outputs.forEach((output) => {
      rawTransaction += decimalToFixedByteHex(Number(output.amount), 8, true)
      rawTransaction += decimalToCompactHex(output.scriptPubKey.length / 2)
      rawTransaction += output.scriptPubKey
    })

    rawTransaction += '00000000'

    setRawTransaction(rawTransaction)
  }

  return (
    <InteractionCard title='交易构造器'>
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
                  vout: '',
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
              key={index}
              className='flex items-center space-x-2'
            >
              <Input
                className='bg-background'
                placeholder='交易ID'
                value={input.txid}
                onChange={(e) => {
                  const newInputs = [...inputs]
                  newInputs[index].txid = e.target.value
                  setInputs(newInputs)
                }}
              ></Input>
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
              ></Input>

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
              key={index}
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
                placeholder='输出金额'
                value={output.amount}
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
      <TransactionSplitTab hex={rawTransaction} />
    </InteractionCard>
  )
}
