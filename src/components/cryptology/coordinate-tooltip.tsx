import { TooltipProps } from 'recharts'

export default function CoordinateTooltip({
  active,
  payload
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload
    return (
      <div className='p-1 border border-gray-300 rounded shadow-sm bg-background'>
        ({`${dataPoint.x}, ${dataPoint.y}`})
      </div>
    )
  }
  return null
}
