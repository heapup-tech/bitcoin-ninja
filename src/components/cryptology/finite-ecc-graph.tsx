'use client'

import { GETBGCOLORS } from '@/lib/constants'
import { getEccFormula, isPrime } from '@/lib/math'
import { cn } from '@/lib/utils'
import { TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { InlineMath } from '../math'
import { Input } from '../ui/input'
import CoordinateTooltip from './coordinate-tooltip'

interface FiniteEccGraphProps {
  a?: number
  b?: number
  p?: number
}

export default function FiniteEccGraph({
  a: initA = 1,
  b: initB = 1,
  p: initP = 5
}: FiniteEccGraphProps) {
  const [a, setA] = useState(initA)
  const [b, setB] = useState(initB)
  const [p, setP] = useState(initP)

  const [equation, setEquation] = useState('')

  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    const points: Array<{ x: number; y: number }> = []
    for (let x = 0; x < p; x++) {
      for (let y = 0; y < p; y++) {
        if (Math.pow(y, 2) % p === (Math.pow(x, 3) + a * x + b) % p) {
          points.push({ x, y })
        }
      }
    }
    setPoints(points)

    setEquation(getEccFormula(a, b, p))
  }, [a, b, p])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-4'>
      <div className='flex flex-col items-center'>
        <InlineMath
          formula={equation}
          className='text-xl text-primary'
        />
        <ResponsiveContainer
          className='mt-4'
          width='100%'
          minHeight={400}
        >
          <ScatterChart>
            <CartesianGrid
              stroke='#ECECEC'
              strokeDasharray='3 3'
            />
            <XAxis
              dataKey='x'
              type='number'
              name='x'
              padding={{ right: 20 }}
            />
            <YAxis
              dataKey='y'
              type='number'
              name='y'
              padding={{ top: 20 }}
            />
            <Tooltip content={<CoordinateTooltip />} />
            <Scatter
              data={points}
              fill='red'
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className='flex justify-center flex-col gap-y-4'>
        <div className='h-1/2 flex justify-center flex-col gap-y-4'>
          <div className='flex items-center gap-x-2'>
            <div className='w-20 text-right'>Curve: </div>

            <div className='flex items-center rounded-md border shadow-sm h-7'>
              <div className={cn(GETBGCOLORS(0), 'w-6 text-center h-full')}>
                a
              </div>
              <Input
                className='w-20 h-full px-2 bg-background border-none py-0 shadow-none'
                type='number'
                defaultValue={a}
                onChange={(e) => setA(Number(e.target.value))}
              />
            </div>

            <div className='flex items-center rounded-md border shadow-sm h-7'>
              <div className={cn(GETBGCOLORS(0), 'w-6 text-center h-full')}>
                b
              </div>
              <Input
                className='w-20 h-full px-2 bg-background border-none py-0 shadow-none'
                type='number'
                defaultValue={b}
                onChange={(e) => setB(Number(e.target.value))}
              />
            </div>
          </div>
          <div className='flex items-center gap-x-2'>
            <div className='w-20 text-right'>Mod: </div>
            <div className='flex items-center rounded-md border shadow-sm h-7'>
              <div className={cn(GETBGCOLORS(1), 'w-6 text-center h-full')}>
                p
              </div>
              <Input
                className='w-20 h-full px-2 bg-background border-none py-0 shadow-none'
                type='number'
                defaultValue={p}
                onChange={(e) => setP(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div className='flex-1 flex flex-col gap-y-4'>
          {!isPrime(p) && (
            <div className='flex items-center gap-x-2'>
              <TriangleAlert className='w-5 h-5 text-red-600' />
              <InlineMath formula='p' /> 非素数
            </div>
          )}
          <span>有效点数量: {points.length + 1}(包括无穷远点)</span>
        </div>
      </div>
    </div>
  )
}
