import UnisatWallet from '@/lib/unisat-wallet'
import { createContext, useContext } from 'react'

interface UnisatWalletContextProps {
  unisat: UnisatWallet
}

export const UnisatWalletContext =
  createContext<UnisatWalletContextProps | null>(null)

export default function UnisatWalletProvider({
  children
}: React.PropsWithChildren<{}>) {
  const unisat = new UnisatWallet()
  return (
    <UnisatWalletContext.Provider
      value={{
        unisat
      }}
    >
      {children}
    </UnisatWalletContext.Provider>
  )
}

export const useUnisatWalletContext = () => {
  const context = useContext(UnisatWalletContext)
  if (!context) {
    throw new Error('unisat must be used within a UnisatWalletProvider')
  }
  return context
}
