'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'

export default function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant='outline'
      className='p-2 border-none shadow-none'
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }}
    >
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  )
}
