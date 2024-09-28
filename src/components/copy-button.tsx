'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'
import * as React from 'react'

interface CopyButtonProps extends ButtonProps {
  value: string
}

export function CopyButton({ className, value, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1400)
    }
  }, [copied])

  return (
    <Button
      size='icon'
      variant='ghost'
      className={cn(
        className,
        'z-10 h-6 w-6 [&_svg]:size-5 bg-transparent hover:bg-transparent',
        copied &&
          '[&_svg]:animate-code-block-hide [&_svg:nth-of-type(2)]:animate-code-block-show'
      )}
      onClick={() => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(value)
          setCopied(true)
        }
      }}
      {...props}
    >
      <span className='sr-only'>Copy</span>

      <CopyIcon className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]' />

      <CheckIcon className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] opacity-0' />
    </Button>
  )
}
