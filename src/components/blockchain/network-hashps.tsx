'use client'

import { Button } from '@/components/ui/button'
import { getNetworkHashps } from '@/server-actions/network-hashps'
import { useQuery } from '@tanstack/react-query'
import { RotateCw } from 'lucide-react'

export default function NetworkHashps() {
  const {
    data: networkHashps,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['networkHashps'],
    queryFn: () => getNetworkHashps(),
    enabled: false
  })

  return (
    <div className='flex gap-x-4 items-center mt-4'>
      <Button
        size='sm'
        onClick={() => refetch()}
        disabled={isFetching}
      >
        查询全网平均算力(每秒哈希次数)
        {isFetching && <RotateCw className='animate-spin w-4 h-4 ml-2' />}
      </Button>
      {networkHashps && (
        <span className='text-lg font-medium'>{networkHashps} H/s</span>
      )}
    </div>
  )
}
