'use client'

import { truncateAddress } from '@/lib/address'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { useUnisatWalletContext } from '../unisat-provider'

export default function UtxoList() {
  const { unisat } = useUnisatWalletContext()

  const [utxos, setUtxos] = useState<
    {
      txid: string
      vout: number
      value: number
      status: {
        confirmed: boolean
        block_hash: string
        block_height: number
        block_time: number
      }
    }[]
  >([])
  const [querying, setQuerying] = useState(false)
  const [network, setNetwork] = useState<UnisatNetwork>('livenet')
  const [totalSats, setTotalSats] = useState(0)

  const [address, setAddress] = useState<string | null>(null)
  useEffect(() => {
    if (unisat.hasInstalled()) {
      unisat.autoConnect().then((res) => {
        if (res && res.length > 0) {
          setAddress(res[0])
        }
      })

      unisat.getNetwork().then((res) => {
        setNetwork(res)
      })
    }
  }, [unisat])

  const onConnect = async () => {
    try {
      const res = await unisat.connect()
      if (res && res.length > 0) {
        setAddress(res[0])
      }
    } catch (error: any) {
      if (error.code === 4001) {
        toast.warning('用户拒绝连接')
        return
      }
      toast.warning('未检测到 unisat 钱包')
    }
  }

  const onQueryUtxo = async () => {
    try {
      setQuerying(true)
      const utxos = await fetch(
        `https://blockstream.info/${network === 'testnet' ? 'testnet/' : ''}api/address/${address}/utxo`
      ).then((res) => res.json())

      setUtxos(utxos)
      setQuerying(false)
    } catch (error) {
      setQuerying(false)
    }
  }

  const handleClick = useCallback(() => {
    if (!address) {
      onConnect()
    } else {
      onQueryUtxo()
    }
  }, [address])

  useEffect(() => {
    if (utxos.length > 0) {
      const total = utxos.reduce((acc, utxo) => acc + utxo.value, 0)
      setTotalSats(total)
    }
  }, [utxos])

  return (
    <div className='mt-4'>
      <div className='flex items-center gap-x-4'>
        <Button
          onClick={handleClick}
          disabled={querying}
        >
          {address ? '查询 UTXO' : '连接钱包'}
          {querying && <Loader className='ml-2 h-4 w-4 animate-spin' />}
        </Button>

        <div>
          余额: {totalSats} sat = {totalSats / 1e8} BTC
        </div>
      </div>

      {utxos.length > 0 && (
        <div className='mt-4'>
          <div className='rounded-md mt-4 border bg-background'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>交易ID</TableHead>
                  <TableHead className='text-center'>输出索引</TableHead>
                  <TableHead className='text-center'>聪数量</TableHead>
                  <TableHead className='text-center'>区块号</TableHead>
                  <TableHead className='text-center'>已确认</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utxos.map((utxo) => (
                  <TableRow key={utxo.txid + utxo.vout}>
                    <TableCell>
                      <Link
                        href={`https://mempool.space/${network === 'testnet' ? 'testnet/' : ''}tx/${utxo.txid}`}
                        target='_blank'
                        className={cn(
                          'font-medium underline underline-offset-4 text-primary'
                        )}
                      >
                        {truncateAddress(utxo.txid)}
                      </Link>
                    </TableCell>
                    <TableCell className='text-center'>{utxo.vout}</TableCell>
                    <TableCell className='text-center'>{utxo.value}</TableCell>
                    <TableCell className='text-center'>
                      <Link
                        href={`https://mempool.space/${network === 'testnet' ? 'testnet/' : ''}block/${utxo.status.block_hash}`}
                        target='_blank'
                        className={cn(
                          'font-medium underline underline-offset-4 text-primary'
                        )}
                      >
                        {utxo.status.block_height}
                      </Link>
                    </TableCell>
                    <TableCell className='text-center'>
                      {utxo.status.confirmed ? '是' : '否'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
