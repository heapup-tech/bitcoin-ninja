import { subsidy } from '@/lib/blockchain/block'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { numericFormatter } from 'react-number-format'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'

const HALVED_BLOCKS = [
  {
    height: 0,
    subsidy: subsidy(0),
    date: 1231006505,
    dateFormater: 'YYYY-MM-DD HH:mm:ss',
    totalMined: 0
  },
  {
    height: 210000,
    subsidy: subsidy(210000),
    date: 1354116278,
    dateFormater: 'YYYY-MM-DD HH:mm:ss',
    totalMined: 10500000
  },
  {
    height: 420000,
    subsidy: subsidy(420000),
    date: 1468082773,
    dateFormater: 'YYYY-MM-DD HH:mm:ss',
    totalMined: 15750000
  },
  {
    height: 630000,
    subsidy: subsidy(630000),
    date: 1589225023,
    dateFormater: 'YYYY-MM-DD HH:mm:ss',
    totalMined: 18375000
  },
  {
    height: 840000,
    subsidy: subsidy(840000),
    date: 1713571767,
    dateFormater: 'YYYY-MM-DD HH:mm:ss',
    totalMined: 19687500
  },
  {
    height: 1050000,
    subsidy: subsidy(1050000),
    date: 1839513600,
    dateFormater: 'YYYY-MM-DD',
    totalMined: 20343750
  },
  {
    height: 1260000,
    subsidy: subsidy(1260000),
    date: 1964736000,
    dateFormater: 'YYYY-MM-DD',
    totalMined: 20671875
  }
]
export default function HalvingTable() {
  return (
    <div className='border rounded-md bg-background'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>减半次数</TableHead>
            <TableHead>区块高度</TableHead>
            <TableHead>区块补跌(BTC)</TableHead>
            <TableHead>日期(东八区)</TableHead>
            <TableHead>已挖总量(BTC)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {HALVED_BLOCKS.map((block, index) => (
            <TableRow key={index}>
              <TableCell>{index}</TableCell>
              <TableCell>{block.height}</TableCell>
              <TableCell>
                {`${numericFormatter(
                  BigNumber(block.subsidy.toString())
                    .dividedBy(100000000)
                    .toFixed(8),
                  {
                    decimalScale: 8
                  }
                )}`}{' '}
                btc
              </TableCell>
              <TableCell>
                {dayjs.unix(block.date).format(block.dateFormater)}
              </TableCell>
              <TableCell>
                {numericFormatter(String(block.totalMined), {
                  thousandSeparator: true
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
