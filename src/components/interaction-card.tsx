import { PropsWithChildren } from 'react'

export default function InteractionCard({
  children,
  title,
  description
}: PropsWithChildren<{
  title: string
  description?: string
}>) {
  return (
    <div className='border rounded-lg p-4 mt-2 bg-cyan-50/20'>
      <h1 className='text-xl font-semibold'>{title}</h1>
      {description && (
        <div className='text-foreground/60 text-sm'>{description}</div>
      )}

      <div className='mt-4'>{children}</div>
    </div>
  )
}
