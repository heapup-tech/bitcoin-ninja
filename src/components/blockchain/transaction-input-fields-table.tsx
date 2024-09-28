import Code from '@/components/code'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function TransactionInputFieldsTable() {
  return (
    <div className='border rounded-md bg-background'>
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
              <strong>TXID</strong>
            </TableCell>
            <TableCell className='border-r'>32 字节</TableCell>
            <TableCell className='border-r'></TableCell>
            <TableCell>
              要花费的 <Code>UTXO</Code> 来自于哪个交易ID
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='border-r'>
              <strong>VOUT</strong>
            </TableCell>
            <TableCell className='border-r'>4 字节</TableCell>
            <TableCell className='border-r'>小端序</TableCell>
            <TableCell>
              要花费的 <Code>UTXO</Code> 来自于交易输出的哪个索引号
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>ScriptSig Size</strong>
            </TableCell>
            <TableCell className='border-r'>动态</TableCell>
            <TableCell className='border-r'>Compact Size</TableCell>
            <TableCell>
              <Code>ScriptSig</Code> 字节大小
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>ScriptSig</strong>
            </TableCell>
            <TableCell className='border-r'>动态</TableCell>
            <TableCell className='border-r'></TableCell>
            <TableCell>
              解锁 <Code>UTXO</Code> 的脚本代码
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>Sequence</strong>
            </TableCell>
            <TableCell className='border-r'>4 字节</TableCell>
            <TableCell className='border-r'>小端序</TableCell>
            <TableCell>设置交易是否可以替换或何时可以挖掘</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
