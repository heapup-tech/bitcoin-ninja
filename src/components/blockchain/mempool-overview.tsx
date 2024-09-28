import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { rpcClient } from '@/lib/rpc-client'
import { numericFormatter } from 'react-number-format'

export const revalidate = 1

interface Mempool {
  loaded: boolean
  size: number // 交易数量
  bytes: number // 内存池中所有交易的总字节数
  total_fee: number // 所有交易的总费用
  usage: number // 内存池占用的内存总量
  maxmempool: number // 内存池大小的最大限制
  mempoolminfee: number // 最小费率
  minrelaytxfee: number // 节点配置的最小转发费率
  unbroadcastcount: number // 未广播的交易数量
}

export default async function MempoolOverview() {
  const mempool: Mempool = await rpcClient.call('getmempoolinfo')

  return (
    <Card className='mt-2'>
      <CardHeader className='p-4 pl-6'>
        <CardTitle>当前内存池信息</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid md:grid-cols-2 gap-2 grid-cols-1'>
          <div className='flex'>
            <span>已占内存: &nbsp;</span>
            <span className='font-bold'>
              {numericFormatter(String(mempool.usage / (1024 * 1024)), {
                decimalScale: 2
              })}{' '}
              MB
            </span>
          </div>
          <div className='flex'>
            <span>交易数量: &nbsp;</span>
            <span className='font-bold'>
              {numericFormatter(String(mempool.size), {
                thousandSeparator: true
              })}
            </span>
          </div>
          <div className='flex'>
            <span>总交易费: &nbsp;</span>
            <span className='font-bold'>
              {numericFormatter(String(mempool.total_fee), {
                decimalScale: 2
              })}{' '}
              BTC
            </span>
          </div>

          <div className='flex'>
            <span>总交易大小: &nbsp;</span>
            <span className='font-bold'>
              {numericFormatter(String(mempool.bytes / (1024 * 1024)), {
                decimalScale: 2
              })}{' '}
              vMB
            </span>
          </div>

          <div className='flex'>
            <span>最低内存池费率: &nbsp;</span>
            <span className='font-bold'>
              {numericFormatter(String(mempool.mempoolminfee * 1e5), {
                decimalScale: 2
              })}{' '}
              sat/byte
            </span>
          </div>

          <div className='flex'>
            <span>最低转发费率: &nbsp;</span>
            <span className='font-bold'>
              {numericFormatter(String(mempool.minrelaytxfee * 1e5), {
                decimalScale: 2
              })}{' '}
              sat/byte
            </span>
          </div>

          <div className='flex'>
            <span>未广播交易数量: &nbsp;</span>
            <span className='font-bold'>
              {numericFormatter(String(mempool.unbroadcastcount), {
                thousandSeparator: true
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
