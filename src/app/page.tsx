import Hero from '@/components/hero'
import dynamic from 'next/dynamic'
const Features = dynamic(() => import('@/components/features'), { ssr: false })

export default function Home() {
  return (
    <main className='flex min-h-[100vh-4rem] flex-col items-center p-24'>
      <Hero />
      <Features />
    </main>
  )
}
