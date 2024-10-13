import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import Code from '../code'

const PSBTGlobalFields = [
  {
    name: 'Unsigned Transaction',
    keytype: '0x00',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '-',
    valuedataDescription: (
      <>
        原始交易数据, 每个输入中的 <Code>scriptSig</Code> 和{' '}
        <Code>witness</Code>必须为空
      </>
    )
  },
  {
    name: 'Extended Public Key',
    keytype: '0x01',
    keydata: 'xpub',
    keyofdataDescription: 'BIP32 定义的78字节序列化扩展公钥',
    valuedata: '4字节主拓展秘钥指纹 + 32 字节路径',
    valuedataDescription: 'BIP 32 定义的主拓展密钥指纹和公钥的导出路径'
  },
  {
    name: 'Transaction Version',
    keytype: '0x02',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '4字节小端序',
    valuedataDescription: '交易版本号'
  },
  {
    name: 'Locktime',
    keytype: '0x03',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '4字节小端序',
    valuedataDescription: '交易 Locktime'
  },
  {
    name: 'Input Count',
    keytype: '0x04',
    keydata: '-',
    keydataDescription: '-',
    valuedata: 'Compact Size',
    valuedataDescription: '交易输入数量'
  },
  {
    name: 'Output Count',
    keytype: '0x05',
    keydata: '-',
    keydataDescription: '-',
    valuedata: 'Compact Size',
    valuedataDescription: '交易输出数量'
  }
  // {
  //   name: 'Transaction Modifiable Flags',
  //   keytype: '0x06',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: '1 字节标识',
  //   valuedataDescription:
  //     '8个比特位, 第 0 位表示是否可修改输入, 第 1 位表示是否可修改输出, 第 2 位表示是否有 SIGHASH_SINGLE 标志'
  // },
  // {
  //   name: 'PSBT Version Number',
  //   keytype: '0xfb',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: '',
  //   valuedataDescription: 'PSBT 版本号, 若省略则默认为 0'
  // },
  // {
  //   name: 'Proprietary Use Type',
  //   keytype: '0xfc',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: '-',
  //   valuedataDescription: '-'
  // }
]

export default function PSBTGlobalFieldTable() {
  return (
    <div className='border rounded-md bg-background overflow-hidden'>
      <Table>
        <TableHeader className='border-b'>
          <TableRow>
            <TableHead className='border-r'>字段名</TableHead>
            <TableHead className='border-r'>keytype</TableHead>
            <TableHead className='border-r'>keydata</TableHead>
            <TableHead className='border-r'>keydata 描述</TableHead>
            <TableHead className='border-r'>valuedata</TableHead>
            <TableHead>valuedata 描述</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PSBTGlobalFields.map((field, index) => (
            <TableRow
              key={'global-' + field.name}
              // className={cn(field.isAccent && 'bg-green-100 dark:bg-green-900')}
            >
              <TableCell className='border-r'>{field.name}</TableCell>
              <TableCell className='border-r'>{field.keytype}</TableCell>
              <TableCell className='border-r'>{field.keydata}</TableCell>
              <TableCell className='border-r'>
                {field.keydataDescription}
              </TableCell>
              <TableCell className='border-r'>{field.valuedata}</TableCell>
              <TableCell>{field.valuedataDescription}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
