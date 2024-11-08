'use client'

import {
  Background,
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
  nodes: Node[]
  edges: Edge[]
}

function UtxoNode() {
  return (
    <>
      <Handle
        type='source'
        position={Position.Right}
      />
      <div className='border border-green-300 p-2'>Input</div>
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

  const nodes: Node[] = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: { label: 'Node 1' },
      type: 'utxo'
    },
    {
      id: '2',
      position: { x: 100, y: 100 },
      data: { label: 'Node 2' }
    }
  ]
  const edges: Edge[] = [
    {
      id: '1-2',
      source: '1',
      target: '2',
      animated: true
    }
  ]
  return (
    <div className='h-64 border rounded overflow-hidden'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodeTypes={nodeTypes}
        colorMode={colorMode}
      >
        <Background
          color='#ff0000'
          gap={16}
        />
      </ReactFlow>
    </div>
  )
}
