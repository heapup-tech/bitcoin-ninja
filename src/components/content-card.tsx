import { ReactNode } from 'react'
import { Label } from './ui/label'

type ContentCardProps = {
  title?: string | ReactNode
  children?: ReactNode
  content?: string
}

export default function ContentCard({
  title,
  content,
  children
}: ContentCardProps) {
  return (
    <div className='flex flex-col gap-y [&:not(:first-child)]:mt-4 gap-y-1'>
      {title && <Label className='flex items-center'>{title}</Label>}

      {content && (
        <div className='bg-background text-base break-all border rounded-md shadow-sm px-3 py-1.5 min-h-9'>
          {content}
        </div>
      )}

      {children}
    </div>
  )
}
