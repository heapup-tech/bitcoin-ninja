'use client'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState } from 'react'

export default function ScaleableImage({
  className,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <img
          className={cn(
            'border rounded-lg dark:invert p-2 cursor-zoom-in object-contain mt-2',
            className
          )}
          onClick={() => setIsOpen(true)}
          alt={alt}
          {...props}
        />
      </DialogTrigger>
      <DialogContent className='w-[80%] p-0 max-w-max'>
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>
        <img
          className='w-full h-full border rounded-lg dark:invert p-2 cursor-zoom-out'
          alt={alt}
          onClick={() => setIsOpen(false)}
          {...props}
        />
      </DialogContent>
    </Dialog>
  )
}
