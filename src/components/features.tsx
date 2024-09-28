'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'

const features = [
  {
    icon: '/react.svg',
    title: 'Powered by React',
    description: 'Use react to bring faster access speed to your website.'
  },
  {
    icon: '/design.svg',
    title: 'Modern design',
    description:
      'The exquisite modern style design provides visitors with an attractive experience.'
  },
  {
    icon: '/markdown.svg',
    title: 'Markdwon',
    description: 'Support using markdown or mdx to write your website content.'
  },
  {
    icon: '/custom.svg',
    title: 'Customization',
    description: 'Custom components to override built-in components.'
  }
]
export default function Features() {
  const { resolvedTheme: mode } = useTheme()
  return (
    <div className='container m-auto mb-20 grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-4'>
      {features.map((feature) => (
        <div
          className={`rounded-md  p-4 ${
            mode === 'dark' ? 'bg-zinc-800' : 'bg-zinc-100'
          }`}
          key={feature.title}
        >
          <Image
            className='flex h-12 w-12 items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-400/90 p-2'
            src={feature.icon}
            width={48}
            height={48}
            alt=''
          />
          <h1 className={`mt-4 text-xl font-semibold mb-2`}>{feature.title}</h1>
          <p
            className={`mt-1 ${
              mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}
