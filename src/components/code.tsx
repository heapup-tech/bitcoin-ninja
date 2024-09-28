import { PropsWithChildren } from 'react'

export default function Code({ children }: PropsWithChildren<{}>) {
  return (
    <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'>
      {children}
    </code>
  )
}
