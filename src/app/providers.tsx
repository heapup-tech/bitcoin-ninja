'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UnisatWalletProvider from '../components/unisat-provider'

export default function Providers({ children }: React.PropsWithChildren<{}>) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
    >
      <QueryClientProvider client={new QueryClient()}>
        <UnisatWalletProvider>
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        </UnisatWalletProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
