import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { GETBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const CodeBlock = dynamic(() => import('@/components/code-block'), {
  ssr: false
})

export default function RpcMethodTable({
  method,
  description,
  args = [],
  customReturnsTitle = '返回值',
  returns = [],
  demoLog
}: {
  method: string
  description: string
  args?: {
    name: string
    type: string
    optional: boolean
    default: string
    description: string
  }[]
  customReturnsTitle?: string
  returns?: {
    name: string
    type: string
    description: string
  }[]
  demoLog?: string
}) {
  return (
    <div className='border rounded-md mt-4 bg-background overflow-hidden'>
      <div className='border-b p-2 bg-muted font-semibold text-xl'>
        <div>
          <Link
            href={`https://developer.bitcoin.org/reference/rpc/${method}.html`}
            target='_blank'
            className='text-primary'
          >
            {method}
          </Link>
        </div>

        <div className='text-xs font-normal mt-1'>{description}</div>
      </div>

      {args && args.length > 0 && (
        <div className={cn(returns && returns.length > 0 && 'border-b')}>
          <div className={cn('border-b p-2 font-medium', GETBGCOLORS(0))}>
            参数列表
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='border-r w-40'>参数名</TableHead>
                <TableHead className='text-center border-r'>类型</TableHead>
                <TableHead className='text-center border-r'>必选</TableHead>
                <TableHead className='text-center border-r'>默认值</TableHead>
                <TableHead className='text-center'>描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {args.map((arg, index) => (
                <TableRow key={arg.name}>
                  <TableCell className='font-medium border-r'>
                    {arg.name}
                  </TableCell>
                  <TableCell className='text-center border-r'>
                    {arg.type}
                  </TableCell>
                  <TableCell className='text-center border-r flex justify-center'>
                    {!arg.optional ? (
                      <Check className='text-center w-4 h-4 text-green-500' />
                    ) : (
                      <X className='text-center w-4 h-4 text-red-500' />
                    )}
                  </TableCell>
                  <TableCell className='text-center border-r'>
                    {arg.default || '-'}
                  </TableCell>

                  <TableCell className='text-center'>
                    {arg.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {returns && returns.length > 0 && (
        <div>
          <div className={cn('border-b p-2 font-medium', GETBGCOLORS(1))}>
            {customReturnsTitle}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='border-r w-40'>名称</TableHead>
                <TableHead className='text-center border-r'>类型</TableHead>
                <TableHead className='text-center'>描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.map((returnField, index) => (
                <TableRow key={returnField.name}>
                  <TableCell className='font-medium border-r'>
                    {returnField.name}
                  </TableCell>
                  <TableCell className='text-center border-r'>
                    {returnField.type}
                  </TableCell>

                  <TableCell className='text-center'>
                    {returnField.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {demoLog && (
        <div>
          <div className={cn('border-b p-2 font-medium', GETBGCOLORS(2))}>
            示例输出
          </div>
          <CodeBlock
            code={demoLog}
            language='json'
          />
        </div>
      )}
    </div>
  )
}
