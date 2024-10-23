'use client'

import EllipticCurve, { Point } from '@/lib/blockchain/ecc'
import { GETBGCOLORS } from '@/lib/constants'
import { getEccFormula, isPrime } from '@/lib/math'
import { cn } from '@/lib/utils'
import { TriangleAlert } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
  p: initP = 7
}: FiniteEccGraphProps) {
  const [a, setA] = useState(initA)
  const [b, setB] = useState(initB)
  const [p, setP] = useState(initP)
  const [pointP, setPointP] = useState<Point | null>(null)
  const [pointQ, setPointQ] = useState<Point | null>(null)
  const [pointPQ, setPointPQ] = useState<Point | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const ec = useRef<EllipticCurve>(new EllipticCurve(a, b, p))

  const [selectedPoint, setSelectedPoint] = useState<{
    x: number
    y: number
  } | null>(null)

  const [equation, setEquation] = useState('')

  const [points, setPoints] = useState<Array<Point>>([])

  const [subGroup, setSubGroup] = useState<Array<Point>>([])

  useEffect(() => {
    ec.current = new EllipticCurve(a, b, p)

    setPoints(ec.current.findPoints())

    setEquation(getEccFormula(a, b, p))

    setPointPQ(ec.current.addPoints(pointP, pointQ))
  }, [a, b, p])

  const onScatterClick = ({ payload }: any) => {
    setSelectedPoint({
      x: payload.x,
      y: payload.y
    })
  }

  useEffect(() => {
    if (!selectedPoint) return

    setSubGroup(ec.current.getOrders(selectedPoint))
  }, [selectedPoint])

  useEffect(() => {
    if (!pointP || !pointQ) return
    if (!ec.current.isOnCurve(pointP)) {
      setErrorMsg('P 不在曲线上')
    } else if (!ec.current.isOnCurve(pointQ)) {
      setErrorMsg('Q 不在曲线上')
    } else {
      setErrorMsg('')
      setPointPQ(ec.current.addPoints(pointP, pointQ))
    }
  }, [pointP, pointQ])
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
              onClick={onScatterClick}
              cursor='pointer'
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className='flex justify-center flex-col gap-y-4'>
        <div className='h-1/2 flex justify-center flex-col gap-y-2'>
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
          <div className='flex items-center gap-x-2'>
            <div className='w-20 text-right'>P: </div>

            <div className='flex items-center rounded-md border shadow-sm h-7'>
              <div className={cn(GETBGCOLORS(2), 'w-6 text-center h-full')}>
                x
              </div>
              <Input
                className='w-20 h-full px-2 bg-background border-none py-0 shadow-none'
                type='number'
                defaultValue={pointP?.x}
                onChange={(e) =>
                  setPointP({ x: Number(e.target.value), y: pointP?.y || 0 })
                }
              />
            </div>

            <div className='flex items-center rounded-md border shadow-sm h-7'>
              <div className={cn(GETBGCOLORS(2), 'w-6 text-center h-full')}>
                y
              </div>
              <Input
                className='w-20 h-full px-2 bg-background border-none py-0 shadow-none'
                type='number'
                defaultValue={pointP?.y}
                onChange={(e) =>
                  setPointP({ x: pointP?.x || 0, y: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className='flex items-center gap-x-2'>
            <div className='w-20 text-right'>Q: </div>

            <div className='flex items-center rounded-md border shadow-sm h-7'>
              <div className={cn(GETBGCOLORS(3), 'w-6 text-center h-full')}>
                x
              </div>
              <Input
                className='w-20 h-full px-2 bg-background border-none py-0 shadow-none'
                type='number'
                defaultValue={pointQ?.x}
                onChange={(e) =>
                  setPointQ({ x: Number(e.target.value), y: pointQ?.y || 0 })
                }
              />
            </div>

            <div className='flex items-center rounded-md border shadow-sm h-7'>
              <div className={cn(GETBGCOLORS(3), 'w-6 text-center h-full')}>
                y
              </div>
              <Input
                className='w-20 h-full px-2 bg-background border-none py-0 shadow-none'
                type='number'
                defaultValue={pointQ?.y}
                onChange={(e) =>
                  setPointQ({ x: pointQ?.x || 0, y: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className='flex items-center gap-x-2'>
            <div className='w-20 text-right'>P + Q: </div>

            <div className='flex items-center rounded-md border shadow-sm h-7'>
              <div className={cn(GETBGCOLORS(4), 'w-6 text-center h-full')}>
                x
              </div>
              <Input
                className='w-20 h-full px-2 bg-background border-none py-0 shadow-none'
                type='number'
                value={pointPQ?.x}
                disabled={true}
              />
            </div>

            <div className='flex items-center rounded-md border shadow-sm h-7'>
              <div className={cn(GETBGCOLORS(4), 'w-6 text-center h-full')}>
                y
              </div>
              <Input
                className='w-20 h-full px-2 bg-background border-none py-0 shadow-none'
                type='number'
                disabled={true}
                value={pointPQ?.y}
              />
            </div>
          </div>

          <div className='text-destructive'>{errorMsg}</div>
        </div>
        <div className='flex-1 flex flex-col gap-y-4'>
          {!isPrime(p) && (
            <div className='flex items-center gap-x-2'>
              <TriangleAlert className='w-5 h-5 text-red-600' />
              <InlineMath formula='p' /> 非素数
            </div>
          )}
          <div>有效点数量: {points.length + 1}(包括无穷远点)</div>
          {selectedPoint && (
            <div className='border p-2 bg-background rounded-md'>
              <div>
                P: ({selectedPoint.x}, {selectedPoint.y})
              </div>

              <div>阶: {subGroup.length}</div>

              <div>
                子群:{' '}
                {subGroup.map((p, index) => {
                  if (p === null) return `∞`
                  return (
                    <span key={String(p.x) + String(p.y) + index}>
                      {index + 1}P ({p.x}, {p.y}) {'->'} &nbsp;
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
