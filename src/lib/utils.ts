import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function truncate(value: string, front: number = 5, back: number = 5) {
  return `${value.slice(0, front)}...${value.slice(-back)}`
}

export function random({ min = 0, max }: { min?: number; max: number }) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
