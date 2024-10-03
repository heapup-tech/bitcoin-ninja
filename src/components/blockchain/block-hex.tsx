import { GETCOLORS, GETHOVERBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function BlockHex({ hex }: { hex: string }) {
  const version = hex.slice(0, 8)
  const previousBlockHash = hex.slice(8, 72)
  const merkleRoot = hex.slice(72, 136)
  const time = hex.slice(136, 144)
  const bits = hex.slice(144, 152)
  const nonce = hex.slice(152, 160)
  const transactionCount = hex.slice(160, 162)
  const transactions = hex.slice(162)

  return (
    <div className='border rounded-lg p-2 font-semibold break-all whitespace-pre-wrap bg-background'>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(GETCOLORS(0), GETHOVERBGCOLORS(0))}
        >
          <span>{version}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Version</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(GETCOLORS(1), GETHOVERBGCOLORS(1))}
        >
          <span>{previousBlockHash}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Previous Block</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(GETCOLORS(2), GETHOVERBGCOLORS(2))}
        >
          <span>{merkleRoot}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Merkle Root</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(GETCOLORS(3), GETHOVERBGCOLORS(3))}
        >
          <span>{time}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Time</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(GETCOLORS(4), GETHOVERBGCOLORS(4))}
        >
          <span>{bits}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Bits</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(GETCOLORS(5), GETHOVERBGCOLORS(5))}
        >
          <span>{nonce}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Nonce</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(GETCOLORS(6), GETHOVERBGCOLORS(6))}
        >
          <span>{transactionCount}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Transaction Count</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(GETCOLORS(7), GETHOVERBGCOLORS(7))}
        >
          <span>{transactions}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Transactions</span>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
