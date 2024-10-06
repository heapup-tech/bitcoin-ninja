import { splitRawTransaction } from '@/lib/blockchain/transaction'
import { GETCOLORS, GETHOVERBGCOLORS } from '@/lib/constants'
import { cn, random } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export default function TransactionHex({ hex }: { hex: string }) {
  const tx = splitRawTransaction(hex)

  return (
    <div className='border rounded-lg px-3 py-2 font-semibold break-all whitespace-pre-wrap text-lg bg-background relative'>
      {/* <CopyButton
        value={hex}
        className={cn(
          'absolute right-3 top-2 text-zinc-400 dark:text-zinc-400'
        )}
      /> */}

      <div>
        <Tooltip>
          <TooltipTrigger
            asChild
            className={cn(
              GETCOLORS(0),
              GETHOVERBGCOLORS(0),
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
                GETCOLORS(1),
                GETHOVERBGCOLORS(1),
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
                GETCOLORS(2),
                GETHOVERBGCOLORS(2),
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
              GETCOLORS(3),
              GETHOVERBGCOLORS(3),
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
            key={input.scriptSig + random({ max: 1000 })}
            className={cn(GETCOLORS(4), 'hover:cursor-pointer')}
          >
            <Tooltip>
              <TooltipTrigger
                asChild
                className={cn(GETHOVERBGCOLORS(4))}
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
                className={cn(GETHOVERBGCOLORS(4))}
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
                className={cn(GETHOVERBGCOLORS(4))}
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
                className={cn(GETHOVERBGCOLORS(4))}
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
                className={cn(GETHOVERBGCOLORS(4))}
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
              GETCOLORS(5),
              GETHOVERBGCOLORS(5),
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
            className={cn(GETCOLORS(6), 'hover:cursor-pointer')}
          >
            <Tooltip>
              <TooltipTrigger
                asChild
                className={cn(GETHOVERBGCOLORS(6))}
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
                className={cn(GETHOVERBGCOLORS(6))}
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
                className={cn(GETHOVERBGCOLORS(6))}
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
              className={cn(GETCOLORS(7), 'hover:cursor-pointer')}
            >
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className={cn(GETHOVERBGCOLORS(7))}
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
                        className={cn(GETHOVERBGCOLORS(7))}
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
                        className={cn(GETHOVERBGCOLORS(7))}
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
              GETCOLORS(8),
              GETHOVERBGCOLORS(8),
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
    </div>
  )
}
