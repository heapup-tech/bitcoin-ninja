'use client'

import { getEccFormula } from '@/lib/math'
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
  variable = false,
  initA = -1,
  initB = 1,
  disableZoom = false,
  fnData = [],
  annotations = []
}: EccGraphProps) {
  const [a, setA] = useState(initA)
  const [b, setB] = useState(initB)
  const [equation, setEquation] = useState('')
  const [isValidate, setIsValidate] = useState(true)

  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    plot(a, b)

    if (4 * Math.pow(a, 3) + 27 * b * b === 0) {
      setIsValidate(false)
    } else {
      setIsValidate(true)
    }

    setEquation(getEccFormula(a, b))
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
      <div className='flex flex-col items-center mt-4'>
        <InlineMath
          formula={equation}
          className='text-xl text-primary'
        />
        <div ref={targetRef} />

        {variable && (
          <div className='flex items-center gap-y-4 space-x-6'>
            <div className='flex items-center'>
              <span>a&nbsp;</span>
              <Input
                className='w-20 h-7 bg-background'
                defaultValue={a}
                onChange={(e) => setA(Number(e.target.value))}
                type='number'
              />
            </div>

            <div className='flex items-center'>
              <span>b&nbsp;</span>
              <Input
                className='w-20 h-7  bg-background'
                defaultValue={b}
                onChange={(e) => setB(Number(e.target.value))}
                type='number'
              />
            </div>
            {!isValidate && (
              <>
                <span className='text-destructive'>无效值</span>{' '}
                <InlineMath formula='4a^3 + 27b^2 = 0' />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
