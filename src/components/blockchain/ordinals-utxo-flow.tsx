'use client'

import { cn } from '@/lib/utils'
import {
  ColorMode,
  Edge,
  Handle,
  Node,
  Position,
  ReactFlow
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface UTXOFlowProps {
  nodes: Node<UtxoNodeData>[]
  edges: Edge[]
}

interface UtxoNodeData extends Record<string, unknown> {
  type: 'input' | 'output' | 'fee'
  index: number
  amount: bigint
  ordinalsStart: number
  ordinalsEnd: number
}

type UtxoNodeType = {
  data: UtxoNodeData
}

function UtxoNode({ data }: UtxoNodeType) {
  return (
    <>
      <Handle
        type={data.type === 'input' ? 'source' : 'target'}
        position={data.type === 'input' ? Position.Right : Position.Left}
      />
      <div
        className={cn(
          'border py-0.5 px-2 bg-background rounded-md flex flex-col',
          {
            'border-green-400': data.type === 'input',
            'border-amber-400': data.type === 'output'
          }
        )}
      >
        <div className='font-semibold'>
          {data.type === 'input' ? 'Input' : 'Output'} {data.index}
        </div>
        <div className={cn('text-sm')}>{data.amount} sats</div>
        <div className='text-sm'>
          ordinals: {data.ordinalsStart} ~ {data.ordinalsEnd}
        </div>
      </div>
    </>
  )
}

export default function OrdinalsUtxoFlow({
  nodes: initialNodes = [],
  edges: initialEdges = []
}: UTXOFlowProps) {
  const { theme } = useTheme()

  const [colorMode, setColorMode] = useState<ColorMode>('system')

  useEffect(() => {
    setColorMode(theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  const nodeTypes = { utxo: UtxoNode }

  const [nodes, setNodes] = useState<Node<UtxoNodeData>[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  return (
    <div className='h-80 overflow-hidden'>
      <ReactFlow
        className='bg-transparent'
        nodes={nodes}
        edges={edges}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodeTypes={nodeTypes}
        colorMode={colorMode}
        fitView
        fitViewOptions={{ maxZoom: 1.2, minZoom: 1 }}
      ></ReactFlow>
    </div>
  )
}
