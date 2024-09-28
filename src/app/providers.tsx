'use client'

import { ThemeProvider } from '@/components/theme-provider'

export default function Providers({ children }: React.PropsWithChildren<{}>) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
    >
      {children}
    </ThemeProvider>
  )
}
