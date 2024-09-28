import Code from '@/components/code'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function TransactionWitnessFieldsTable() {
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
              <strong>Stack Items</strong>
            </TableCell>
            <TableCell className='border-r'>动态</TableCell>
            <TableCell className='border-r'>Compact Size</TableCell>
            <TableCell>入栈的元素数量</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>
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
                        <strong>Size</strong>
                      </TableCell>
                      <TableCell className='border-r'>动态</TableCell>
                      <TableCell className='border-r'>Compact Size</TableCell>
                      <TableCell>
                        <Code>Item</Code> 字节大小
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='border-r'>
                        <strong>Item</strong>
                      </TableCell>
                      <TableCell className='border-r'>动态</TableCell>
                      <TableCell className='border-r'></TableCell>
                      <TableCell>压入栈中的数据</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
