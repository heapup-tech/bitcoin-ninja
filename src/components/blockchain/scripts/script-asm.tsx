import { GETCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { script } from 'bitcoinjs-lib'

type ScriptAsmProps = { asm: string } | { hex: string }

const isASM = (props: ScriptAsmProps): props is { asm: string } => {
  if ('asm' in props) return true

  return false
}

export default function ScriptAsm(props: ScriptAsmProps) {
  let internalAsm = ''
  if (isASM(props)) {
    internalAsm = props.asm
  } else {
    internalAsm = script.toASM(Buffer.from(props.hex, 'hex'))
  }

  return (
    <div className='break-all px-4 py-4 border rounded-lg bg-black text-white space-y-4'>
      {internalAsm.split(' ').map((item, index) => (
        <span
          key={item + index}
          className={cn('block', GETCOLORS(index))}
        >
          {item}
        </span>
      ))}
    </div>
  )
}
