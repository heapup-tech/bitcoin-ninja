'use client'

import {
  calculateTxid,
  extractDataForTxid,
  splitRawTransaction
} from '@/lib/blockchain/transaction'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import InteractionCard from '../interaction-card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export default function TransactionTxidCalculator() {
  const [rawTx, setRawTx] = useState('')
  const [splitedTx, setSplitedTx] = useState<Transaction>()
  const [calculateRawTx, setCalculateRawTx] = useState('')

  const [txid, setTxid] = useState('')
  const [reversedTxid, setReversedTxid] = useState('')

  const [isError, setIsError] = useState(false)
  useEffect(() => {
    if (!rawTx) {
      setIsError(false)
      setSplitedTx(undefined)
      setCalculateRawTx('')
      setTxid('')
      setReversedTxid('')

      return
    }

    try {
      const splitedTx = splitRawTransaction(rawTx)
      setSplitedTx(splitedTx)

      const calculateRawTx = extractDataForTxid(splitedTx)
      setCalculateRawTx(calculateRawTx)
      setIsError(false)
    } catch (error) {
      setIsError(true)
      setSplitedTx(undefined)
      setCalculateRawTx('')
      setTxid('')
      setReversedTxid('')
    }
  }, [rawTx])

  useEffect(() => {
    if (!calculateRawTx) return
    try {
      const txid = calculateTxid(calculateRawTx)
      setTxid(txid.naturalTxid)
      setReversedTxid(txid.reversedTxid)
      setIsError(false)
    } catch (error) {
      setIsError(true)
      setCalculateRawTx('')
      setTxid('')
      setReversedTxid('')
    }
  }, [calculateRawTx])

  return (
    <InteractionCard
      title='交易ID计算器'
      description='从原始交易数据计算交易ID'
    >
      <div className='mt-4'>
        <div className='text-sm font-medium'>原始交易数据</div>
        <Textarea
          rows={8}
          defaultValue={rawTx}
          onChange={(e) => setRawTx(e.target.value)}
          className={cn(
            'bg-background mt-0.5 text-base',
            isError && 'bg-red-200'
          )}
        />
      </div>

      {splitedTx && (
        <div>
          <div className='break-all px-3 py-2 border rounded-md mt-4 bg-black text-white'>
            <span className='bg-primary'>{splitedTx.version}</span>
            {splitedTx.marker && <span>{splitedTx.marker}</span>}
            {splitedTx.flag && <span>{splitedTx.flag}</span>}
            <span className='bg-primary'>{splitedTx.inputCount}</span>

            {splitedTx.inputs.map((input, index) => (
              <span
                key={index}
                className='bg-primary'
              >
                <span>{input.txid}</span>
                <span>{input.vout}</span>
                <span>{input.scriptSigSize}</span>
                <span>{input.scriptSig}</span>
                <span>{input.sequence}</span>
              </span>
            ))}

            <span className='bg-primary'>{splitedTx.outputCount}</span>

            {splitedTx.outputs.map((output, index) => (
              <span
                key={index}
                className='bg-primary'
              >
                <span>{output.amount}</span>
                <span>{output.scriptPubKeySize}</span>
                <span>{output.scriptPubKey}</span>
              </span>
            ))}

            {splitedTx.witness &&
              splitedTx.witness.map((witness, index) => (
                <span key={index}>
                  <span>{witness.stackItems}</span>
                  {Object.keys(witness)
                    .sort()
                    .map((key) => {
                      if (key === 'stackItems') return

                      return (
                        <span key={witness[key].size + witness[key].item}>
                          <span>{witness[key].size}</span>
                          <span>{witness[key].item}</span>
                        </span>
                      )
                    })}
                </span>
              ))}
            <span className='bg-primary'>{splitedTx.lockTime}</span>
          </div>
          <div className='text-foreground/60 text-sm'>
            标记背景色的数据参与交易ID的计算
          </div>
        </div>
      )}

      <div className='mt-4'>
        <div className='text-sm font-medium'>TXID</div>
        <Input
          readOnly
          defaultValue={txid}
          className='bg-background mt-0.5'
        />
      </div>

      <div className='mt-4'>
        <div className='text-sm font-medium'>TXID (小端序)</div>
        <div className='text-foreground/60 text-xs origin-left scale-75'>
          最终交易ID
        </div>
        <Input
          readOnly
          defaultValue={reversedTxid}
          className='bg-background mt-1'
        />
      </div>
    </InteractionCard>
  )
}
