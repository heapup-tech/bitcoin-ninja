import ShinyButton from '@/components/shiny-button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='flex flex-col items-center p-10 w-full overflow-hidden'>
      <div className='relative m-auto mt-16 flex flex-col h-96 items-center justify-center py-4 text-center'>
        <h1 className='text-4xl font-semibold'>学习比特币的最佳教程</h1>
        <p className='mt-2 text-lg text-stone-400'>
          从基础到高级, 成为比特币专家
        </p>

        <div className='mt-4'>
          <Link href='/technical/basic/blockchain'>
            <ShinyButton className='text-2xl font-semibold'>
              开始学习
            </ShinyButton>
          </Link>
        </div>
      </div>
    </main>
  )
}
