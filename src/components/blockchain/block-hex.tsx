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
          className='text-red-500 hover:bg-red-200 hover:cursor-pointer'
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
          className='text-orange-500 hover:bg-orange-200 hover:cursor-pointer'
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
          className='text-lime-500 hover:bg-lime-200 hover:cursor-pointer'
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
          className='text-green-500 hover:bg-green-200 hover:cursor-pointer'
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
          className='text-cyan-500 hover:bg-cyan-200 hover:cursor-pointer'
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
          className='text-indigo-500 hover:bg-indigo-200 hover:cursor-pointer'
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
          className='text-fuchsia-500 hover:bg-fuchsia-200 hover:cursor-pointer'
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
          className='text-teal-500 hover:bg-teal-200 hover:cursor-pointer'
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
