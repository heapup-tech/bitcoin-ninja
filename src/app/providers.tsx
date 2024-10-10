'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import ecc from '@bitcoinerlab/secp256k1'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initEccLib } from 'bitcoinjs-lib'
import UnisatWalletProvider from '../components/unisat-provider'

initEccLib(ecc)

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
