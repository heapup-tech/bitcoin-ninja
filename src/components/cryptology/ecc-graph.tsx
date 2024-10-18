'use client'

import functionPlot from 'function-plot'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
export default function EccGraph() {
  const [a, setA] = useState(-1)
  const [b, setB] = useState(1)

  useEffect(() => {
    plot(a, b)
  }, [a, b])

  useEffect(() => {
    plot(a, b)
  }, [])

  const plot = (a: number, b: number) => {
    functionPlot({
      target: '#plot',
      title: `椭圆曲线函数图像`,
      width: 600,
      height: 400,
      grid: true,
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
        }
      ]
    })
  }

  return (
    <div>
      <div className='flex items-center gap-y-4 space-x-6'>
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
      </div>
      <div
        id='plot'
        className='w-full mt-4'
      ></div>
    </div>
  )
}
