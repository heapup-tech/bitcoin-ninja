import { splitRawTransaction } from '@/lib/blockchain/transaction'
import { COLORS, HOVERBGCOLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function TransactionHex({ hex }: { hex: string }) {
  const tx = splitRawTransaction(hex)
  return (
    <div className='border rounded-lg px-3 py-2 font-semibold break-all whitespace-pre-wrap text-lg bg-background'>
      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(
            COLORS[0 % COLORS.length],
            HOVERBGCOLORS[0 % HOVERBGCOLORS.length],
            'hover:cursor-pointer'
          )}
        >
          <span>{tx.version}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Version</span>
        </TooltipContent>
      </Tooltip>
      {tx.marker && (
        <Tooltip>
          <TooltipTrigger
            asChild
            className={cn(
              COLORS[1 % COLORS.length],
              HOVERBGCOLORS[1 % HOVERBGCOLORS.length],
              'hover:cursor-pointer'
            )}
          >
            <span>{tx.marker}</span>
          </TooltipTrigger>
          <TooltipContent>
            <span>Marker</span>
          </TooltipContent>
        </Tooltip>
      )}

      {tx.flag && (
        <Tooltip>
          <TooltipTrigger
            asChild
            className={cn(
              COLORS[2 % COLORS.length],
              HOVERBGCOLORS[2 % HOVERBGCOLORS.length],
              'hover:cursor-pointer'
            )}
          >
            <span>{tx.flag}</span>
          </TooltipTrigger>
          <TooltipContent>
            <span>Flag</span>
          </TooltipContent>
        </Tooltip>
      )}

      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(
            COLORS[3 % COLORS.length],
            HOVERBGCOLORS[3 % HOVERBGCOLORS.length],
            'hover:cursor-pointer'
          )}
        >
          <span>{tx.inputs.length.toString(16).padStart(2, '0')}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Input Count</span>
        </TooltipContent>
      </Tooltip>

      {tx.inputs.map((input, index) => (
        <span
          key={input.scriptSig}
          className={cn(COLORS[4 % COLORS.length], 'hover:cursor-pointer')}
        >
          <Tooltip>
            <TooltipTrigger
              asChild
              className={cn(HOVERBGCOLORS[4 % HOVERBGCOLORS.length])}
            >
              <span>{input.txid}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>Input {index}: TXID</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              asChild
              className={cn(HOVERBGCOLORS[4 % HOVERBGCOLORS.length])}
            >
              <span>{input.vout}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>Input {index}: VOUT</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              asChild
              className={cn(HOVERBGCOLORS[4 % HOVERBGCOLORS.length])}
            >
              <span>{input.scriptSigSize}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>Input {index}: ScriptSig Size</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              asChild
              className={cn(HOVERBGCOLORS[4 % HOVERBGCOLORS.length])}
            >
              <span>{input.scriptSig}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>Input {index}: ScriptSig</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              asChild
              className={cn(HOVERBGCOLORS[4 % HOVERBGCOLORS.length])}
            >
              <span>{input.sequence}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>Input {index}: Sequence</span>
            </TooltipContent>
          </Tooltip>
        </span>
      ))}

      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(
            COLORS[5 % COLORS.length],
            HOVERBGCOLORS[5 % HOVERBGCOLORS.length],
            'hover:cursor-pointer'
          )}
        >
          <span>{tx.outputs.length.toString(16).padStart(2, '0')}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Output Count</span>
        </TooltipContent>
      </Tooltip>

      {tx.outputs.map((output, index) => (
        <span
          key={output.scriptPubKey}
          className={cn(COLORS[6 % COLORS.length], 'hover:cursor-pointer')}
        >
          <Tooltip>
            <TooltipTrigger
              asChild
              className={cn(HOVERBGCOLORS[6 % HOVERBGCOLORS.length])}
            >
              <span>{output.amount}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>Output {index}: Amount</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              asChild
              className={cn(HOVERBGCOLORS[6 % HOVERBGCOLORS.length])}
            >
              <span>{output.scriptPubKeySize}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>Output {index}: ScriptPubKey Size</span>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              asChild
              className={cn(HOVERBGCOLORS[6 % HOVERBGCOLORS.length])}
            >
              <span>{output.scriptPubKey}</span>
            </TooltipTrigger>
            <TooltipContent>
              <span>Output {index}: ScriptPubKey</span>
            </TooltipContent>
          </Tooltip>
        </span>
      ))}

      {tx.witness &&
        tx.witness.map((witness, index) => (
          <span
            key={index}
            className={cn(COLORS[7 % COLORS.length], 'hover:cursor-pointer')}
          >
            <Tooltip>
              <TooltipTrigger
                asChild
                className={cn(HOVERBGCOLORS[7 % HOVERBGCOLORS.length])}
              >
                <span>{witness.stackItems}</span>
              </TooltipTrigger>
              <TooltipContent>
                <span>Witness {index}: Stack Items</span>
              </TooltipContent>
            </Tooltip>
            {Object.keys(witness).map((key) => {
              if (key === 'stackItems') return null
              return (
                <span key={key}>
                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      className={cn(HOVERBGCOLORS[7 % HOVERBGCOLORS.length])}
                    >
                      <span>{witness[key].size}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        Witness {index}: Size {key}
                      </span>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      asChild
                      className={cn(HOVERBGCOLORS[7 % HOVERBGCOLORS.length])}
                    >
                      <span>{witness[key].item}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        Witness {index}: Item {key}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </span>
              )
            })}
          </span>
        ))}

      <Tooltip>
        <TooltipTrigger
          asChild
          className={cn(
            COLORS[8 % COLORS.length],
            HOVERBGCOLORS[8 % HOVERBGCOLORS.length],
            'hover:cursor-pointer'
          )}
        >
          <span>{tx.lockTime}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>Locktime</span>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
