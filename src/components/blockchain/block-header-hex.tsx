import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function BlockHeaderHex({
  version,
  previousBlockHash,
  merkleRoot,
  time,
  bits,
  nonce
}: {
  version: string
  previousBlockHash: string
  merkleRoot: string
  time: string
  bits: string
  nonce: string
}) {
  return (
    <div className='border rounded-lg p-2 font-semibold break-all whitespace-pre-wrap mt-2'>
      <Tooltip>
        <TooltipTrigger
          asChild
          className='text-violet-500 hover:bg-violet-200 hover:cursor-pointer'
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
          className='text-pink-500 hover:bg-pink-200 hover:cursor-pointer'
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
          className='text-blue-500 hover:bg-blue-200 hover:cursor-pointer'
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
          className='text-lime-500 hover:bg-lime-200 hover:cursor-pointer'
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
          className='text-teal-500 hover:bg-teal-200 hover:cursor-pointer'
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
          className='text-rose-500 hover:bg-rose-200 hover:cursor-pointer'
        >
          <span>{nonce}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Nonce</span>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
