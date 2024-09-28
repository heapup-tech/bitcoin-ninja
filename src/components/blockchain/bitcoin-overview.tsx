import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { rpcClient } from '@/lib/rpc-client'
import { numericFormatter } from 'react-number-format'

export default async function BitcoinOverview() {
  const blockchainInfo = await rpcClient
    .call('getblockchaininfo', [], {
      revalidate: 300
    })
    .catch(() => {
      return null
    })

  return blockchainInfo ? (
    <Card className='mt-4'>
      <CardHeader className='p-4 pl-6'>
        <CardTitle>比特币数据总览</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid md:grid-cols-2 gap-2 mt-4 grid-cols-1'>
          <div className='flex items-center gap-x-4'>
            <span className='font-bold'>区块数据大小: </span>
            <span className='text-primary'>
              {numericFormatter(
                String(blockchainInfo.size_on_disk / 1e9 || ''),
                {
                  decimalScale: 2
                }
              )}{' '}
              GB
            </span>
          </div>

          <div className='flex items-center gap-x-4'>
            <span className='font-bold'>总区块数: </span>
            <span className='text-primary'>
              {numericFormatter(String(blockchainInfo.blocks || ''), {
                thousandSeparator: true
              })}
            </span>
          </div>

          <div className='flex items-center gap-x-4 col-span-full truncate'>
            <span className='font-bold'>链工作量: </span>
            <span
              className='text-primary truncate'
              title={blockchainInfo.chainwork}
            >
              {blockchainInfo.chainwork}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null
}
