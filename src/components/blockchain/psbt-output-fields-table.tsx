import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const PSBTOutputFields = [
  {
    name: 'Redeem Script',
    keytype: '0x00',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '赎回脚本',
    valuedataDescription: 'P2SH 自定义脚本',
    isAccent: true
  },
  {
    name: 'Witness Script',
    keytype: '0x01',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '赎回脚本',
    valuedataDescription: 'P2WSH 自定义脚本',
    isAccent: true
  },
  // {
  //   name: 'BIP32 Derivation Path',
  //   keytype: '0x02',
  //   keydata: '公钥',
  //   keydataDescription: 'BIP32 指纹和路径',
  //   valuedata: '4字节指纹 + 32字节路径',
  //   valuedataDescription: 'BIP32 指纹和路径'
  // },
  {
    name: 'Output Amount',
    keytype: '0x03',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '8字节金额',
    valuedataDescription: '输出金额',
    isAccent: true
  },
  {
    name: 'Output Script',
    keytype: '0x04',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '输出脚本',
    valuedataDescription: '输出脚本',
    isAccent: true
  },
  {
    name: 'Taproot Internal Key',
    keytype: '0x05',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '32字节公钥',
    valuedataDescription: 'Taproot 内部公钥'
  },
  {
    name: 'Taproot Tree',
    keytype: '0x06',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '(1字节深度 + 1字节叶子版本 + 脚本长度 + 脚本)*',
    valuedataDescription: 'Taproot 脚本树, 按照深度构建脚本树 '
  }
  // {
  //   name: 'Taproot Key BIP 32 Derivation Path',
  //   keytype: '0x07',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: '-',
  //   valuedataDescription: '-'
  // },
  // {
  //   name: 'MuSig2 Participant Public Keys',
  //   keytype: '0x08',
  //   description: ''
  // },
  // {
  //   name: 'BIP 353 DNSSEC proof',
  //   keytype: '0x35',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: 'DNSSEC 证明',
  //   valuedataDescription: 'BIP353 DNSSEC 证明'
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

export default function PSBTOutputFieldTable() {
  return (
    <div className='border rounded-md'>
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
          {PSBTOutputFields.map((field, index) => (
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
