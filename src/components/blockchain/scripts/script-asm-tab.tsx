import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { script } from 'bitcoinjs-lib'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import ScriptAsm from './script-asm'

const CodeBlock = dynamic(() => import('@/components/code-block'), {
  ssr: false
})

export default function ScriptAsmTab({
  txid,
  hex,
  index,
  type = 'ScriptPubKey'
}: {
  txid?: string
  hex: string
  index?: string
  type: 'ScriptPubKey' | 'ScriptSig' | 'Witness'
}) {
  /* TODO: parse scriptsig to asm format */

  let asm = ''
  try {
    asm = script.toASM(Buffer.from(hex, 'hex'))
  } catch (error) {}

  return (
    <div className='mt-4'>
      <Tabs defaultValue='asm'>
        <TabsList className=''>
          <TabsTrigger value='asm'>ASM</TabsTrigger>
          <TabsTrigger value='hex'>Hex</TabsTrigger>
        </TabsList>

        <TabsContent value='asm'>
          <ScriptAsm asm={asm} />
        </TabsContent>

        <TabsContent value='hex'>
          <CodeBlock
            language='text'
            code={hex || ''}
          />
        </TabsContent>
      </Tabs>
      {txid && (
        <div className='text-xs mt-1'>
          交易ID:{' '}
          <Link
            href={`https://mempool.space/tx/${txid}`}
            target='_blank'
            className='underline text-primary'
          >
            {txid}
          </Link>
          {index && (
            <span className='mx-1'>
              （{type === 'ScriptPubKey' ? 'Output' : 'Input'} {index}）
            </span>
          )}
        </div>
      )}
    </div>
  )
}
