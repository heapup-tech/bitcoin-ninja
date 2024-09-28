import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const replaceBlockPowers = [
  {
    height: 1,
    power_50: '100%',
    power_40: '73.6%',
    power_30: '44.6%',
    power_20: '20%',
    power_10: '5.1%'
  },
  {
    height: 2,
    power_50: '100%',
    power_40: '66.4%',
    power_30: '32.5%',
    power_20: '10.3%',
    power_10: '1.3%'
  },
  {
    height: 3,
    power_50: '100%',
    power_40: '60.3%',
    power_30: '23.9%',
    power_20: '5.3%',
    power_10: '0.4%'
  },
  {
    height: 4,
    power_50: '100%',
    power_40: '55%',
    power_30: '17.7%',
    power_20: '2.7%',
    power_10: '0.1%'
  },
  {
    height: 5,
    power_50: '100%',
    power_40: '50.4%',
    power_30: '13.2%',
    power_20: '1.4%',
    power_10: '0.02%'
  },
  {
    height: 6,
    power_50: '100%',
    power_40: '46.2%',
    power_30: '9.9%',
    power_20: '0.7%',
    power_10: '0.006%'
  },
  {
    height: 7,
    power_50: '100%',
    power_40: '42.5%',
    power_30: '7.4%',
    power_20: '0.4%',
    power_10: '0.001%'
  },
  {
    height: 8,
    power_50: '100%',
    power_40: '39.1%',
    power_30: '5.6%',
    power_20: '0.2%',
    power_10: '0.0004%'
  },
  {
    height: 9,
    power_50: '100%',
    power_40: '36.0%',
    power_30: '4.2%',
    power_20: '0.1%',
    power_10: '0.0001%'
  },
  {
    height: 10,
    power_50: '100%',
    power_40: '33.2%',
    power_30: '3.1%',
    power_20: '0.06%',
    power_10: '0.00003%'
  }
]

export default function ReplaceBlockPowerTable() {
  return (
    <Table className='border rounded-md mt-4 bg-background'>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>区块高度</TableHead>
          <TableHead>控制50%+算力</TableHead>
          <TableHead>控制40%+算力</TableHead>
          <TableHead>控制30%+算力</TableHead>
          <TableHead>控制20%+算力</TableHead>
          <TableHead>控制10%+算力</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {replaceBlockPowers.map((block) => (
          <TableRow key={block.height}>
            <TableCell className='font-medium'>{block.height}</TableCell>
            <TableCell>{block.power_50}</TableCell>
            <TableCell>{block.power_40}</TableCell>
            <TableCell>{block.power_30}</TableCell>
            <TableCell>{block.power_20}</TableCell>
            <TableCell>{block.power_10}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
