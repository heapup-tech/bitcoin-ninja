import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { BGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const fields = [
  {
    name: 'Version',
    size: '4 字节',
    format: '小端序',
    description: '区块版本号'
  },
  {
    name: 'Previous Block',
    size: '32 字节',
    format: '自然字节序',
    description: '前一个区块的区块哈希'
  },
  {
    name: 'Merkle Root',
    size: '32 字节',
    format: '自然字节序',
    description: '区块中包含的所有交易ID的默克尔根'
  },
  {
    name: 'Time',
    size: '4 字节',
    format: '小端序',
    description: '当前时间的 Unix 时间戳'
  },
  {
    name: 'Bits',
    size: '4 字节',
    format: '小端序',
    description: '目标值的紧凑表示'
  },
  {
    name: 'Nonce',
    size: '4 字节',
    format: '小端序',
    description: '随机数，用于尝试找到有效哈希'
  },
  {
    name: 'Transaction Count',
    size: '动态',
    format: 'compact size',
    description: '区块中包含的交易数量'
  },
  {
    name: 'Transactions',
    size: '动态',
    format: '交易数据',
    description: '区块中包含的所有原始交易数据'
  }
] as const

export default function BlockStructure({
  highlightFieldName = []
}: {
  highlightFieldName: Array<(typeof fields)[number]['name']>
}) {
  return (
    <div className='border rounded-md mt-4 bg-background'>
      <div className='border-b p-2 bg-muted font-semibold text-lg'>
        区块结构
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='border-r w-40'>字段</TableHead>
            <TableHead className='text-center border-r'>大小</TableHead>
            <TableHead className='text-center border-r'>格式</TableHead>
            <TableHead className='text-center'>描述</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow
              key={field.name}
              className={cn(
                highlightFieldName.includes(field.name) &&
                  BGCOLORS[index % BGCOLORS.length]
              )}
            >
              <TableCell className='font-medium border-r'>
                {field.name}
              </TableCell>
              <TableCell className='text-center border-r'>
                {field.size}
              </TableCell>
              <TableCell className='text-center border-r'>
                {field.format}
              </TableCell>
              <TableCell className='text-center'>{field.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
