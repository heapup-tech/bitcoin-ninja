import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

type RadixKey = 'binary' | 'octal' | 'decimal' | 'hexadecimal'
type RadixPrefix = '0b' | '0o' | '0d' | '0x'

interface RadixViewerProps {
  radix: Partial<{
    [key in RadixKey]: string
  }>
  perfer?: RadixKey
}

const radixPrefixMap: Record<RadixKey, RadixPrefix> = {
  binary: '0b',
  octal: '0o',
  decimal: '0d',
  hexadecimal: '0x'
}

export default function RadixViewer({ radix, perfer }: RadixViewerProps) {
  const prefixes = Object.keys(radix) as RadixKey[]
  const [selectedPrefix, setSelectedPrefix] = useState<RadixKey>()
  const [radixData, setRadixData] = useState('')

  useEffect(() => {
    setSelectedPrefix(perfer ?? prefixes[0])
    setRadixData(radix[perfer ?? prefixes[0]] || '')
  }, [radix, perfer])

  useEffect(() => {
    if (!selectedPrefix) return
    setRadixData(radix[selectedPrefix] || '')
  }, [selectedPrefix, radix])

  if (prefixes.length === 0) return null

  return (
    <div className='flex border rounded-md shadow-sm items-center overflow-hidden'>
      {prefixes.length > 1 ? (
        <Select
          value={selectedPrefix}
          defaultValue={selectedPrefix}
          onValueChange={(value: RadixKey) => setSelectedPrefix(value)}
        >
          <SelectTrigger
            className={cn(
              'w-14 text-center p-2 text-base shadow-none border-l-0 border-t-0 border-b-0 border-r border-muted rounded-none focus:ring-0 bg-muted h-auto self-stretch'
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-background'>
            {prefixes.map((prefix) => (
              <SelectItem
                key={prefix}
                value={prefix}
              >
                {radixPrefixMap[prefix]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className='h-9 flex items-center p-2 w-14 justify-center border-r bg-muted'>
          {radixPrefixMap[prefixes[0]]}
        </div>
      )}
      <div className='flex-1 px-2 py-1.5  bg-background text-base break-all'>
        {radixData}
      </div>
    </div>
  )
}
