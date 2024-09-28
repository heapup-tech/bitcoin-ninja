import ArrowRight from '@/icons/arrow-right'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Hero() {
  return (
    <div className='relative m-auto mt-16 flex h-96 items-center justify-center py-4 text-center'>
      <div className='relative z-10'>
        <h1 className='text-4xl font-semibold '>
          Free document template, Built by HeapUp
        </h1>
        <p className='mt-2 text-xl text-stone-400'>
          Build faster websites with markdown in minutes.
        </p>

        <div className='mt-4'>
          <Link href='https://github.com/heapup-tech/docunicorn'>
            <Button
              variant='default'
              size='lg'
              className='group bg-stone-800 hover:bg-stone-800/90'
            >
              Get Template
              <ArrowRight className='ml-2' />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
