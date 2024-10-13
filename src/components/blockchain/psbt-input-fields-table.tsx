import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const PSBTInputFields = [
  {
    name: 'Non-Witness UTXO',
    keytype: '0x00',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '交易数据',
    valuedataDescription:
      '花费非隔离见证 UTXO 时, 提供的 UTXO 所在交易的完整交易数据'
  },
  {
    name: 'Witness UTXO',
    keytype: '0x01',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '8字节金额 + 锁定脚本长度 + 锁定脚本',
    description: '花费隔离见证 UTXO 时, 提供的 UTXO 的锁定脚本和金额'
  },
  {
    name: 'Partial Signature',
    keytype: '0x02',
    keydata: '公钥',
    keydataDescription: '与签名对应的公钥',
    valuedata: '签名数据',
    valuedataDescription: '部分签名'
  },
  {
    name: 'Sighash Type',
    keytype: '0x03',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '4字节小端序',
    valuedataDescription: 'Sighash 类型'
  },
  {
    name: 'Redeem Script',
    keytype: '0x04',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '赎回脚本',
    valuedataDescription:
      'P2SH 自定义的赎回脚本, 位于交易输入的 scriptSig 字段中'
  },
  {
    name: 'Witness Script',
    keytype: '0x05',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '赎回脚本',
    valuedataDescription:
      'P2WSH 自定义的赎回脚本, 位于交易输入对应的 witness 字段中'
  },
  // {
  //   name: 'BIP32 Derivation Path',
  //   keytype: '0x06',
  //   keydata: '公钥',
  //   keydataDescription: '公钥数据',
  //   valuedata: '4字节主拓展秘钥指纹 + 32 字节路径',
  //   valuedataDescription: 'BIP 32 定义的主拓展密钥指纹和公钥的导出路径'
  // },
  {
    name: 'Final ScriptSig',
    keytype: '0x07',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '解锁脚本',
    valuedataDescription: '最终的 scriptSig 解锁脚本'
  },
  {
    name: 'Final ScriptWitness',
    keytype: '0x08',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '解锁脚本',
    valuedataDescription: '最终的 scriptWitness 解锁脚本'
  },
  // {
  //   name: 'Proof-of-reserves commitment',
  //   keytype: '0x09',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: '32字节',
  //   valuedataDescription: '储备金证明, 将 BIP127'
  // },
  // {
  //   name: 'RIPEMD160 preimage',
  //   keytype: '0x0a',
  //   keydata: '20字节 RIPEMD160 哈希值',
  //   keydataDescription: '对 preimage 的 RIPEMD160 哈希值',
  //   valuedata: 'preimage',
  //   valuedataDescription: ''
  // },
  // {
  //   name: 'SHA256 preimage',
  //   keytype: '0x0b',
  //   keydata: '32字节 SHA256 哈希值',
  //   keydataDescription: '对 preimage 的 SHA256 哈希值',
  //   valuedata: 'preimage',
  //   valuedataDescription: ''
  // },
  // {
  //   name: 'HASH160 preimage',
  //   keytype: '0x0c',
  //   keydata: '20字节 HASH160 哈希值',
  //   keydataDescription: '对 preimage 的 HASH160 哈希值',
  //   valuedata: 'preimage',
  //   valuedataDescription: ''
  // },
  // {
  //   name: 'HASH256 preimage',
  //   keytype: '0x0d',
  //   keydata: '32字节 HASH256 哈希值',
  //   keydataDescription: '对 preimage 的 HASH256 哈希值',
  //   valuedata: 'preimage',
  //   valuedataDescription: ''
  // },
  {
    name: 'Previous TXID',
    keytype: '0x0e',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '32字节 TXID',
    valuedataDescription: '花费的UTXO所在的交易id'
  },
  {
    name: 'Spent Output Index',
    keytype: '0x0f',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '4字节小端序',
    valuedataDescription: '花费的UTXO在其交易中的索引'
  },
  {
    name: 'Sequence Number',
    keytype: '0x10',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '4字节小端序',
    valuedataDescription: '交易输入的序列号'
  },
  // {
  //   name: 'Required Time-based Locktime',
  //   keytype: '0x11',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: '4字节小端序',
  //   valuedataDescription: '基于时间的交易锁定',
  //   isAccent: true
  // },
  // {
  //   name: 'Required Height-based Locktime',
  //   keytype: '0x12',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: '4字节小端序',
  //   valuedataDescription: '基于区块高度的交易锁定',
  //   isAccent: true
  // },
  {
    name: 'Taproot Key Spend Signature',
    keytype: '0x13',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '签名数据',
    valuedataDescription: 'Taproot 秘钥路径花费的签名'
  },
  {
    name: 'Taproot Script Spend Signature',
    keytype: '0x14',
    keydata: '32字节 Taproot 公钥 X 坐标 + leafhash',
    keydataDescription: '-',
    valuedata: '签名数据',
    valuedataDescription: 'Taproot 脚本路径花费的签名'
  },
  {
    name: 'Taproot Leaf Script',
    keytype: '0x15',
    keydata: '控制块',
    keydataDescription:
      'BIP341 规定的脚步路径花费时, 提供的控制块是内部公钥和默克尔证明的组合。',
    valuedata: '脚本',
    valuedataDescription: '花费的叶子的完整脚本'
  },
  {
    name: 'Taproot Key BIP 32 Derivation Path',
    keytype: '0x16',
    keydata: '32字节 Taproot 公钥 X 坐标',
    keydataDescription: '-',
    valuedata: '-',
    valuedataDescription: '-'
  },
  {
    name: 'Taproot Internal Key',
    keytype: '0x17',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '32字节内部公钥的X坐标',
    valuedataDescription: '内部公钥'
  },
  {
    name: 'Taproot Merkle Root',
    keytype: '0x18',
    keydata: '-',
    keydataDescription: '-',
    valuedata: '32字节默克尔根'
  }
  // {
  //   name: 'MuSig2 Participant Public Keys',
  //   keytype: '0x1a',
  //   keydata: '33字节聚合公钥',
  //   keydataDescription: 'KeyAgg 公钥',
  //   valuedata: '压缩公钥列表',
  //   valuedataDescription: '参与计算聚合公钥的压缩公钥列表'
  // },
  // {
  //   name: 'MuSig2 Public Nonce',
  //   keytype: '0x1b',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: '-',
  //   valuedataDescription: '-'
  // },
  // {
  //   name: 'MuSig2 Participant Partial Signature',
  //   keytype: '0x1c',
  //   keydata: '-',
  //   keydataDescription: '-',
  //   valuedata: '-',
  //   valuedataDescription: '-'
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

export default function PSBTInputFieldTable() {
  return (
    <div className='border rounded-md bg-background'>
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
          {PSBTInputFields.map((field, index) => (
            <TableRow key={'global-' + field.name}>
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
