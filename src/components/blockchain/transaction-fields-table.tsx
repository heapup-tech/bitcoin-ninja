import Code from '../code'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import TransactionInputFieldsTable from './transaction-input-fields-table'
import TransactionOutputFieldsTable from './transaction-output-fields-table'
import TransactionWitnessFieldsTable from './transaction-witness-fields-table'

export default function TransactionFieldsTable() {
  return (
    <div className='border rounded-md mt-4 bg-background'>
      <h2 className='text-lg font-semibold p-2 bg-muted'>交易字段</h2>
      <Table>
        <TableHeader>
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
              <strong>Version</strong>
            </TableCell>
            <TableCell className='border-r'>4 字节</TableCell>
            <TableCell className='border-r'>小端序</TableCell>
            <TableCell>交易版本号</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>Marker</strong>
            </TableCell>
            <TableCell className='border-r'>1 字节</TableCell>
            <TableCell className='border-r'></TableCell>
            <TableCell>
              用于表示隔离见证交易。必须为 <Code>00</Code>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>Flag</strong>
            </TableCell>
            <TableCell className='border-r'>1 字节</TableCell>
            <TableCell className='border-r'></TableCell>
            <TableCell>
              用于表示隔离见证交易。必须为 <Code>01</Code> 或更大的数
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>Input Count</strong>
            </TableCell>
            <TableCell className='border-r'>动态</TableCell>
            <TableCell className='border-r'>Compact Size</TableCell>
            <TableCell>
              交易输入的 <Code>UTXO</Code> 数量
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>Inputs</strong>
            </TableCell>
            <TableCell
              className='border-r'
              colSpan={3}
            >
              <TransactionInputFieldsTable />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>Output Count</strong>
            </TableCell>
            <TableCell className='border-r'>动态</TableCell>
            <TableCell className='border-r'>Compact Size</TableCell>
            <TableCell>
              交易输出的 <Code>UTXO</Code> 数量
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>Outputs</strong>
            </TableCell>
            <TableCell
              className='border-r'
              colSpan={3}
            >
              <TransactionOutputFieldsTable />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>Witness</strong>
            </TableCell>
            <TableCell
              className='border-r'
              colSpan={3}
            >
              <TransactionWitnessFieldsTable />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className='border-r'>
              <strong>Locktime</strong>
            </TableCell>
            <TableCell className='border-r'>4 字节</TableCell>
            <TableCell className='border-r'>小端序</TableCell>
            <TableCell>
              设置一个时间或高度，该交易可以在此之后进行挖掘
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
