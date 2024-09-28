import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import dayjs from '@/lib/dayjs'
import { rpcClient } from '@/lib/rpc-client'
import { truncate } from '@/lib/utils'
import Link from 'next/link'
import { numericFormatter } from 'react-number-format'

export const revalidate = 300

export default async function BlockList() {
  const blockcount = await rpcClient.call('getblockcount')

  const blocks = await fetch(
    `https://mempool.space/api/v1/blocks/${blockcount}`
  ).then((res) => res.json())

  return (
    <div className='rounded-md mt-4 border bg-background'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>区块高度</TableHead>
            <TableHead className='text-right'>区块哈希</TableHead>
            <TableHead className='text-right'>区块大小</TableHead>
            <TableHead className='text-right'>交易数量</TableHead>
            <TableHead className='text-right'>区块奖励</TableHead>
            <TableHead className='text-right'>总手续费</TableHead>
            <TableHead className='text-right'>平均费率</TableHead>
            {/* <TableHead className='text-right'>难度值</TableHead> */}
            <TableHead className='text-right'>时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blocks.map((block: any) => (
            <TableRow key={block.id}>
              <TableCell className='font-medium'>
                {numericFormatter(String(block.height), {
                  thousandSeparator: true
                })}
              </TableCell>
              <TableCell className='text-right'>
                <Link
                  href={`https://mempool.space/block/${block.id}`}
                  target='_blank'
                  className='underline hover:text-primary'
                >
                  {truncate(block.id)}
                </Link>
              </TableCell>
              <TableCell className='text-right'>
                {numericFormatter(String(block.size / 1e6), {
                  decimalScale: 2
                })}{' '}
                MB
              </TableCell>
              <TableCell className='text-right'>{block.tx_count}</TableCell>
              <TableCell className='text-right'>
                {numericFormatter(String(block.extras.reward / 1e8), {
                  decimalScale: 3
                })}{' '}
                BTC
              </TableCell>
              <TableCell className='text-right'>
                {numericFormatter(String(block.extras.totalFees / 1e8), {
                  decimalScale: 3
                })}{' '}
                BTC
              </TableCell>
              <TableCell className='text-right'>
                {block.extras.avgFeeRate}
              </TableCell>
              {/* <TableCell className='text-right'>{block.difficulty}</TableCell> */}
              <TableCell className='text-right'>
                {dayjs.unix(block.timestamp).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
