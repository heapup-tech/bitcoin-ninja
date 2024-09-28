import Code from '@/components/code'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function TransactionOutputFieldsTable() {
  return (
    <div className='border rounded-md'>
      <Table>
        <TableHeader className='border-b'>
          <TableRow>
            <TableHead className='border-r'>字段名</TableHead>
            <TableHead className='border-r'>大小</TableHead>
            <TableHead className='border-r'>格式</TableHead>
            <TableHead>描述</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='border-r'>
              <strong>Amount</strong>
            </TableCell>
            <TableCell className='border-r'>8 字节</TableCell>
            <TableCell className='border-r'>小端序</TableCell>
            <TableCell>
              输出的 <Code>UTXO</Code> 包含的聪的数量
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='border-r'>
              <strong>ScriptPubKey Size</strong>
            </TableCell>
            <TableCell className='border-r'>动态</TableCell>
            <TableCell className='border-r'>Compact Size</TableCell>
            <TableCell>
              <Code>ScriptPubKey</Code> 字节大小
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>ScriptPubKey</strong>
            </TableCell>
            <TableCell className='border-r'>动态</TableCell>
            <TableCell className='border-r'></TableCell>
            <TableCell>输出的锁定脚本</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
