import dayjs from '@/lib/dayjs'
import { rpcClient } from '@/lib/rpc-client'
import { numericFormatter } from 'react-number-format'

export default async function BlockOverview({
  blockHeight
}: {
  blockHeight?: number
}) {
  let blockHeightOrHash = blockHeight

  if (!blockHeight) {
    blockHeightOrHash = await rpcClient
      .call('getbestblockhash', [], {
        revalidate: 300
      })
      .catch(() => {
        return null
      })
  }
  const latestBlock = await rpcClient
    .call('getblockstats', [blockHeightOrHash], {
      revalidate: false
    })
    .catch(() => {
      return null
    })

  if (!latestBlock) return null

  return (
    <div className='border rounded-md px-4 py-2 mt-4 bg-background'>
      <h1 className='font-bold text-2xl'>最新区块</h1>
      <div className='grid md:grid-cols-2 gap-2 mt-4 grid-cols-1'>
        <div>
          <span className='font-bold'>区块高度: </span>
          <span className='text-primary'>{latestBlock.height}</span>
        </div>
        <div>
          <span className='font-bold'>区块时间: </span>
          <span className='text-primary'>
            {dayjs.unix(latestBlock.time).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
        <div>
          <span className='font-bold'>交易数: </span>
          <span className='text-primary'>{latestBlock.txs}</span>
        </div>
        <div>
          <span className='font-bold'>大小: </span>
          <span className='text-primary'>
            {numericFormatter(String(latestBlock.total_size / 1e6), {
              decimalScale: 2
            })}{' '}
            MB
          </span>
        </div>
        <div>
          <span className='font-bold'>权重: </span>
          <span className='text-primary'>
            {numericFormatter(String(latestBlock.total_weight / 1e6), {
              decimalScale: 2
            })}{' '}
            MWU
          </span>
        </div>
        <div>
          <span className='font-bold'>费率范围: </span>
          <span className='text-primary'>
            {latestBlock.minfeerate}-{latestBlock.maxfeerate} sat/vB
          </span>
        </div>

        <div>
          <span className='font-bold'>区块补跌: </span>
          <span className='text-primary'>
            {numericFormatter(String(latestBlock.subsidy / 1e8), {
              decimalScale: 3
            })}{' '}
            BTC
          </span>
        </div>

        <div>
          <span className='font-bold'>总手续费: </span>
          <span className='text-primary'>
            {numericFormatter(String(latestBlock.totalfee / 1e8), {
              decimalScale: 3
            })}{' '}
            BTC
          </span>
        </div>
      </div>
    </div>
  )
}
