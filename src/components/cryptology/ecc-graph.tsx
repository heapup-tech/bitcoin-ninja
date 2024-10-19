'use client'

import functionPlot, {
  FunctionPlotAnnotation,
  type FunctionPlotDatum
} from 'function-plot'
import { useEffect, useRef, useState } from 'react'
import { InlineMath } from '../math'
import { Input } from '../ui/input'

interface EccGraphProps {
  variable?: boolean
  initA?: number
  initB?: number

  disableZoom?: boolean

  fnData?: FunctionPlotDatum[]

  annotations?: FunctionPlotAnnotation[]
}
export default function EccGraph({
  variable = true,
  initA = -1,
  initB = 1,
  disableZoom = false,
  fnData = [],
  annotations = []
}: EccGraphProps) {
  const [a, setA] = useState(initA)
  const [b, setB] = useState(initB)
  const [isValidate, setIsValidate] = useState(true)

  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    plot(a, b)

    if (4 * Math.pow(a, 3) + 27 * b * b === 0) {
      setIsValidate(false)
    } else {
      setIsValidate(true)
    }
  }, [a, b])

  useEffect(() => {
    plot(a, b)

    window.addEventListener('resize', () => plot(a, b))

    return () => {
      window.removeEventListener('resize', () => plot(a, b))
    }
  }, [])

  const plot = (a: number, b: number) => {
    const target = targetRef.current

    if (!target) return

    const ratio = 0.6
    const width = Math.min(target.offsetWidth, 600)
    const height = width * ratio

    functionPlot({
      target,
      title: `y² = x³ ${a < 0 ? '-' : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}x ${b < 0 ? '-' : '+'} ${Math.abs(b)}`,
      width: width,
      height: height,
      grid: true,
      disableZoom,
      tip: {
        xLine: true,
        yLine: true
      },
      data: [
        {
          fn: `sqrt(x^3 + ${a}x + ${b})`,
          color: 'green'
        },
        {
          fn: `-sqrt(x^3 + ${a}x + ${b})`,
          color: 'green'
        },
        ...fnData
      ],
      annotations
    })
  }

  return (
    <div>
      <div
        ref={targetRef}
        className='w-full mt-4'
      />

      {variable && (
        <div className='flex items-center gap-y-4 space-x-6 ml-10 mt-4'>
          <div className='flex items-center'>
            <span>a&nbsp;</span>
            <Input
              className='w-20'
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              type='number'
            />
          </div>

          <div className='flex items-center'>
            <span>b&nbsp;</span>
            <Input
              className='w-20'
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              type='number'
            />
          </div>
          {!isValidate && (
            <>
              <span className='text-destructive'>无效值</span>{' '}
              <InlineMath>{`4a^3 + 27b^2 = 0`}</InlineMath>
            </>
          )}
        </div>
      )}
    </div>
  )
}
