'use client'

import { useUnisatWalletContext } from '@/components/unisat-provider'
import { truncateAddress } from '@/lib/address'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

export default function ConnectButton() {
  const { unisat } = useUnisatWalletContext()

  const [address, setAddress] = useState<string | null>(null)
  useEffect(() => {
    if (unisat.hasInstalled()) {
      unisat.autoConnect().then((res) => {
        if (res && res.length > 0) {
          setAddress(res[0])
        }
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
  return (
    <Button onClick={onConnect}>
      {address ? truncateAddress(address) : '连接钱包'}
    </Button>
  )
}
