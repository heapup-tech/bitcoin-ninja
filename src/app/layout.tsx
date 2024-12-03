import AppFooter from '@/components/app-footer'
import AppHeader from '@/components/app-header'
import { siteConfig } from '@/config/site'
import '@/styles/function-plot.css'
import '@/styles/globals.css'
import 'katex/dist/katex.min.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'sonner'
import Providers from './providers'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <Script
        defer
        src='https://umami.heapup.tech/script.js'
        data-website-id='be9eda04-dfa9-4d40-8e5b-dc5f98ea10db'
      />
      <body className={inter.className}>
        <Providers>
          <div className='flex flex-col justify-between min-h-screen'>
            <AppHeader />
            {children}
            <AppFooter />
          </div>

          <Toaster
            position='top-center'
            richColors
          />
        </Providers>
      </body>
    </html>
  )
}
