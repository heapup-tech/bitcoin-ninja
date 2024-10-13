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
import Code from '../code'
import PSBTGlobalFieldTable from './psbt-global-fields-table'
import PSBTInputFieldTable from './psbt-input-fields-table'
import PSBTOutputFieldTable from './psbt-output-fields-table'

export default function PSBTFieldsTable() {
  return (
    <div className='border rounded-md mt-4 bg-background overflow-hidden'>
      <h2 className='text-lg font-semibold p-2 bg-muted'>PSBT结构</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='border-r'>类别</TableHead>
            <TableHead>描述</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='border-r'>
              <strong>magic</strong>
            </TableCell>
            <TableCell>
              <Code>0x70736274FF</Code>, <Code>0x70736274</Code>转换成字符串为
              <Code>{'PSBT'}</Code>, 表示 PSBT 的开始, <Code>0xFF</Code>为分隔符
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={cn('border-r', GETBGCOLORS(0))}>
              <strong>Global</strong>
            </TableCell>
            <TableCell>
              <PSBTGlobalFieldTable />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className={cn('border-r', GETBGCOLORS(1))}>
              <strong>Inputs</strong>
            </TableCell>
            <TableCell>
              <PSBTInputFieldTable />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className={cn('border-r', GETBGCOLORS(2))}>
              <strong>Outputs</strong>
            </TableCell>
            <TableCell>
              <PSBTOutputFieldTable />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
