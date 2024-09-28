import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  disabledOpcodes,
  opcodeGroups,
  opcodes
} from '@/lib/blockchain/opcodes'
import { opcodeDescription } from '@/lib/blockchain/opcodes-description'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

export default function ScriptOpcodes() {
  return (
    <div className='mt-4'>
      <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
        {opcodeGroups.map((group, index) => (
          <div
            className='rounded border'
            key={group.title}
          >
            <h2 className='text-lg font-semibold p-2 bg-muted'>
              {group.title} ({group.opcodes.length})
            </h2>
            <Table>
              <TableHeader className='border-b'>
                <TableRow>
                  <TableHead className='border-r w-16 text-center'>
                    操作码
                  </TableHead>
                  <TableHead className='border-r w-20 text-center'>
                    有效性
                  </TableHead>
                  <TableHead className='border-r w-48 text-center'>
                    名称
                  </TableHead>
                  <TableHead>描述</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.opcodes.map((opcodeKey) => (
                  <TableRow
                    key={opcodeKey}
                    className={cn(
                      disabledOpcodes.indexOf(opcodeKey) > -1 &&
                        'bg-red-50/50 hover:bg-red-50/70'
                    )}
                  >
                    <TableCell className='border-r text-center'>
                      <strong>{opcodes[opcodeKey]}</strong>
                    </TableCell>
                    <TableCell className='border-r text-center'>
                      <div className='flex justify-center'>
                        {disabledOpcodes.indexOf(opcodeKey) > -1 ? (
                          <X className='text-center w-4 h-4 text-red-500' />
                        ) : (
                          <Check className='text-center w-4 h-4 text-green-500' />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='border-r text-center'>
                      {opcodeKey}
                    </TableCell>
                    <TableCell>{opcodeDescription[opcodeKey] || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  )
}
