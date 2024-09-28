/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { reverseBytes } from '@/lib/blockchain/bytes'
import { isOpcode } from '@/lib/blockchain/opcodes'
import { opcodeStackBehavior } from '@/lib/blockchain/opcodes-stack-behavior'
import ScriptStack from '@/lib/blockchain/script-stack'
import {
  compileP2PKH,
  compileP2WSH,
  isP2SH,
  isP2TR,
  isP2WPKH,
  isP2WSH
} from '@/lib/blockchain/script-utils'
import { splitRawTransaction } from '@/lib/blockchain/transaction'
import { cn } from '@/lib/utils'
import { isHexadecimal } from '@/lib/validator'
import { getRawTransaction } from '@/server-actions/raw-transaction'
import { useQuery } from '@tanstack/react-query'
import { script, Transaction } from 'bitcoinjs-lib'
import { ArrowBigRight, Loader } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { toHex } from 'uint8array-tools'
import InteractionCard from '../interaction-card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Textarea } from '../ui/textarea'

type StackSimulatorProps = {
  txid?: string
  txHex?: string
}

export default function ScriptStackSimulator({
  txid,
  txHex
}: StackSimulatorProps) {
  const [queryTxid, setQueryTxid] = useState(txid)
  const [inIndex, setInIndex] = useState<number | null>(null)
  const [tx, setTx] = useState(txHex)
  const [decodedTxError, setDecodedTxError] = useState(false)
  const [decodedTx, setDecodedTx] = useState<Transaction>()

  const [scriptSig, setScriptSig] = useState('')
  const [scriptPubKey, setScriptPubKey] = useState('')
  const [redeemScript, setRedeemScript] = useState('')

  const [scriptSigASM, setScriptSigASM] = useState<string[]>([])
  const [scriptPubKeyASM, setScriptPubKeyASM] = useState<string[]>([])
  const [redeemScriptASM, setRedeemScriptASM] = useState<string[]>([])

  const [amount, setAmount] = useState(0)

  const stack = useMemo(() => new ScriptStack(), [])

  const [isRunning, setIsRunning] = useState(false)
  const [couldRun, setCouldRun] = useState(true)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [stackItems, setStackItems] = useState<string[]>(stack.data())

  const {
    isFetching: queryTxLoading,
    data: rawTx,
    refetch: queryTransaction
  } = useQuery({
    queryKey: ['raw-transaction', { txid: queryTxid }],
    queryFn: async () => {
      if (!queryTxid) return ''
      const rawTx = await getRawTransaction({ txid: queryTxid })
      setInIndex(null)
      return rawTx
    },
    enabled: isHexadecimal(queryTxid || '', 64),
    staleTime: Infinity
  })

  const {
    isFetching: queryPrevOutTxLoading,
    data: prevOutTx,
    refetch: queryScriptPubKey
  } = useQuery({
    queryKey: [
      'raw-transaction',
      {
        txid:
          inIndex !== null &&
          decodedTx &&
          decodedTx.ins &&
          decodedTx.ins.length > inIndex &&
          toHex(decodedTx?.ins[inIndex].hash || new Uint8Array())
      }
    ],
    queryFn: async () => {
      let rawTx = ''
      if (decodedTx && inIndex != null && decodedTx?.ins[inIndex].hash) {
        const txid = toHex(reverseBytes(decodedTx?.ins[inIndex].hash))
        rawTx = await getRawTransaction({ txid })
      }
      return rawTx
    },
    enabled: false
  })

  useEffect(() => {
    setTx(rawTx)
  }, [rawTx])

  useEffect(() => {
    if (!tx) return
    try {
      setDecodedTx(Transaction.fromHex(tx))
      setDecodedTxError(false)
    } catch (error) {
      setDecodedTxError(true)
    }
  }, [tx])

  useEffect(() => {
    if (!prevOutTx || inIndex === null) return

    try {
      const tx = Transaction.fromHex(prevOutTx)
      const index = decodedTx?.ins[inIndex].index

      if (index !== undefined) {
        setScriptPubKey(toHex(tx.outs[index].script))
        setAmount(tx.outs[index].value)
      }
    } catch (error) {
      toast.error('解析交易失败')
    }
  }, [prevOutTx])

  useEffect(() => {
    if (inIndex === null || !decodedTx || !tx) return

    if (decodedTx.hasWitnesses()) {
      let sig = ''
      const splitedTx = splitRawTransaction(tx)

      if (splitedTx.witness) {
        const inIndexWitness = splitedTx.witness[inIndex]
        sig += inIndexWitness.stackItems
        Object.keys(inIndexWitness).forEach((key) => {
          if (key !== 'stackItems') {
            sig +=
              splitedTx.witness![inIndex][key].size +
              splitedTx.witness![inIndex][key].item
          }
        })
      }
      setScriptSig(sig)
    } else {
      setScriptSig(decodedTx.ins[inIndex].script.toString('hex'))
    }
  }, [inIndex])

  useEffect(() => {
    if (!scriptPubKey) return
    try {
      if (isP2WPKH(scriptPubKey)) {
        let pubkeyHash = script
          .toASM(Buffer.from(scriptPubKey, 'hex'))
          .split(' ')[1]

        const outScript = compileP2PKH(pubkeyHash)
        setScriptPubKeyASM(
          script.toASM(Buffer.from(outScript, 'hex')).split(' ')
        )
      } else if (isP2WSH(scriptPubKey)) {
        let scriptHash = script
          .toASM(Buffer.from(scriptPubKey, 'hex'))
          .split(' ')[1]

        const outScript = compileP2WSH(scriptHash)
        setScriptPubKeyASM(
          script.toASM(Buffer.from(outScript, 'hex')).split(' ')
        )
      } else if (isP2TR(scriptPubKey)) {
      } else {
        let scriptPubKeyASM = script.toASM(Buffer.from(scriptPubKey, 'hex'))
        setScriptPubKeyASM(!scriptPubKeyASM ? [] : scriptPubKeyASM.split(' '))
      }
    } catch (error) {}
  }, [scriptPubKey])

  useEffect(() => {
    if (!scriptSig || !decodedTx || inIndex === null) return
    try {
      if (decodedTx.hasWitnesses()) {
        setScriptSigASM(decodedTx.ins[inIndex].witness.map(toHex))
      } else {
        let scriptSigASM = script.toASM(Buffer.from(scriptSig, 'hex'))
        setScriptSigASM(!scriptSigASM ? [] : scriptSigASM.split(' '))
      }
    } catch (error) {}
  }, [scriptSig, inIndex])

  useEffect(() => {
    if (scriptSig) {
      if (isP2SH(scriptPubKey)) {
        try {
          const scripts = script.decompile(Buffer.from(scriptSig, 'hex'))
          if (scripts) {
            const redeemScript = scripts[scripts.length - 1] as Buffer
            const redeemScriptASM = script.toASM(redeemScript)
            setRedeemScriptASM(redeemScriptASM.split(' '))
            setRedeemScript(toHex(redeemScript))
          }
        } catch (error) {}
      }

      if (isP2WSH(scriptPubKey) && decodedTx && inIndex !== null) {
        try {
          const inIndexWitness = decodedTx.ins[inIndex].witness
          const redeemScript = inIndexWitness[inIndexWitness.length - 1]
          setRedeemScriptASM(script.toASM(redeemScript).split(' '))
        } catch (error) {}
      }
    } else {
      setRedeemScriptASM([])
      setRedeemScript('')
    }
  }, [scriptPubKey, scriptSig])

  const scripts = scriptSigASM.concat(scriptPubKeyASM).concat(redeemScriptASM)

  const restart = () => {
    setCurrentIndex(0)
    stack.clear()
    setCouldRun(true)
    setStackItems([])
  }
  const onNext = () => {
    if (!couldRun) return
    if (currentIndex === scripts.length) restart()
    else {
      const instruction = scripts[currentIndex]
      if (isOpcode(instruction) && !opcodeStackBehavior[instruction]) {
        toast.error(`当前操作码 ${instruction} 行为未定义`)
        setCouldRun(false)
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    }
  }

  useEffect(() => {
    if (currentIndex === 0) setIsRunning(false)
    else if (currentIndex > 0) setIsRunning(true)

    if (currentIndex > scripts.length || currentIndex < 1 || !couldRun) return

    if (
      (isP2SH(scriptPubKey) || isP2WSH(scriptPubKey)) &&
      currentIndex === scriptSigASM.length + scriptPubKeyASM.length + 1
    ) {
      const peek = stack.peek()

      if (peek !== '1') {
        toast.error('脚本哈希验证失败')
        setCouldRun(false)
        return
      } else {
        stack.pop()
      }
    }

    const instruction = scripts[currentIndex - 1]

    if (isOpcode(instruction)) {
      const behavior = opcodeStackBehavior[instruction]
      if (behavior) {
        if (instruction === 'OP_CHECKSIG') {
          behavior(stack, tx, inIndex, scriptPubKey, amount)
        } else if (instruction === 'OP_CHECKMULTISIG') {
          behavior(
            stack,
            tx,
            inIndex,
            isP2SH(scriptPubKey) ? redeemScript : scriptPubKey,
            amount
          )
        } else {
          behavior(stack)
        }
      }
    } else {
      stack.push(instruction)
    }
    setStackItems([...stack.data()])

    if (currentIndex === scripts.length) {
      setIsRunning(false)
    }
  }, [currentIndex])

  return (
    <InteractionCard
      title='脚本执行模拟'
      description='模拟脚本在栈中的执行过程'
    >
      <div className='flex items-center space-x-2 mt-4'>
        <Input
          placeholder='请输入交易 ID'
          value={queryTxid}
          disabled={queryTxLoading || isRunning}
          onChange={(e) => setQueryTxid(e.target.value)}
          className='bg-background text-base'
        />
        <Button
          size='sm'
          onClick={() => queryTransaction()}
          disabled={queryTxLoading || isRunning}
        >
          查询交易
          {queryTxLoading && <Loader className='ml-2 h-4 w-4 animate-spin' />}
        </Button>
      </div>

      <div className='text-sm font-medium mt-4 mb-0.5'>原始交易数据</div>
      <Textarea
        placeholder='查询交易ID 或 手动输入交易数据'
        rows={8}
        defaultValue={rawTx}
        className='bg-background text-base'
        disabled={queryTxLoading || isRunning}
        onChange={(e) => setTx(e.target.value)}
      />
      {decodedTxError && (
        <div className='text-sm text-destructive font-medium'>解析交易失败</div>
      )}

      <div className='flex items-center gap-x-4 mt-4 mb-0.5'>
        <div className='text-sm font-medium flex-shrink-0'>交易输入</div>
        <Select
          onValueChange={(v) => {
            setInIndex(+v)
          }}
          disabled={queryPrevOutTxLoading || isRunning}
          value={inIndex ? inIndex + '' : undefined}
        >
          <SelectTrigger className='bg-background text-base flex-1 truncate'>
            <SelectValue placeholder='选择交易输入' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className='text-base'>
                输出 UTXO 的交易ID - 输出索引
              </SelectLabel>
              {decodedTx?.ins.map((txin, index) => {
                return (
                  <SelectItem
                    key={txin.hash.toString('hex') + txin.index}
                    value={index + ''}
                  >
                    {toHex(reverseBytes(txin.hash))} - {txin.index}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          size='sm'
          onClick={() => queryScriptPubKey()}
          disabled={queryPrevOutTxLoading || isRunning}
        >
          查询锁定脚本
          {queryPrevOutTxLoading && (
            <Loader className='ml-2 h-4 w-4 animate-spin' />
          )}
        </Button>
      </div>

      <div className='flex items-center gap-x-4 mt-4 mb-0.5'>
        <span className='text-sm font-medium flex-shrink-0'>解锁脚本</span>
        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-10 flex-1'>
          <span>{scriptSig}</span>
        </div>
      </div>
      <div className='flex items-center gap-x-4 mt-4 mb-0.5'>
        <span className='text-sm font-medium flex-shrink-0'>锁定脚本</span>

        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-10 flex-1'>
          <span>{scriptPubKey}</span>
        </div>
      </div>
      <div className='flex gap-x-8 mt-4'>
        <div className='flex-1 text-sm'>
          {scriptSigASM && scriptSigASM.length > 0 && (
            <div>
              <div className='text-base font-semibold  ml-8'>解锁脚本</div>
              <div>
                {scriptSigASM.map((asm, index) => (
                  <div
                    key={index}
                    className='break-all flex items-center gap-x-4 mt-2'
                  >
                    <ArrowBigRight
                      size={18}
                      className={cn(
                        'flex-shrink-0 text-primary',
                        index === currentIndex ? 'visible' : 'invisible'
                      )}
                    />
                    <span className='rounded-md border px-2 py-1 text-sm bg-background'>
                      {asm || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scriptPubKeyASM && scriptPubKeyASM.length > 0 && (
            <div className='mt-4'>
              <div className='text-base font-semibold ml-8'>锁定脚本</div>
              <div>
                {scriptPubKeyASM.map((asm, index) => (
                  <div
                    key={index}
                    className='break-all flex items-center gap-x-4 mt-2'
                  >
                    <ArrowBigRight
                      size={18}
                      className={cn(
                        'flex-shrink-0 text-primary',
                        index + scriptSigASM.length === currentIndex
                          ? 'visible'
                          : 'invisible'
                      )}
                    />
                    <span className='rounded-md border bg-background px-2 py-1 text-sm'>
                      {asm || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {redeemScriptASM && redeemScriptASM.length > 0 && (
            <div className='mt-4'>
              <div className='text-base font-semibold ml-8'>赎回脚本</div>
              <div>
                {redeemScriptASM.map((asm, index) => (
                  <div
                    key={index}
                    className='break-all flex items-center gap-x-4 mt-2'
                  >
                    <ArrowBigRight
                      size={18}
                      className={cn(
                        'flex-shrink-0 text-primary',
                        index + scriptSigASM.length + scriptPubKeyASM.length ===
                          currentIndex
                          ? 'visible'
                          : 'invisible'
                      )}
                    />
                    <span className='rounded-md border bg-background px-2 py-1 text-sm'>
                      {asm}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className='w-2/5'>
          <div className='flex my-4 space-x-4 items-center'>
            <div className='text-base font-semibold'>Stack</div>
            <Button
              onClick={onNext}
              size='sm'
              className='px-2 h-auto py-1'
              disabled={
                currentIndex >= scripts.length || !scriptPubKey || !scriptSig
              }
            >
              {currentIndex === scripts.length ? '运行完成' : '下一步'}
            </Button>
            <Button
              onClick={restart}
              size='sm'
              className='px-2 h-auto py-1'
            >
              重新运行
            </Button>
          </div>
          <div className='border-l border-r border-b rounded-bl-md rounded-br-md p-2 mt-2 border-primary min-h-20 bg-background flex flex-col justify-end'>
            {stackItems.reverse().map((item, index) => (
              <div
                key={index}
                className='break-all border rounded-md p-1 mt-2 truncate text-sm  min-h-7'
                title={item}
              >
                {item || '-'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </InteractionCard>
  )
}
