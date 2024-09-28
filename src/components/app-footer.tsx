export default function AppFooter() {
  const year = new Date().getFullYear()
  return (
    <div className='flex h-24 items-center justify-center border-t'>
      Copyright © {year} heapup
    </div>
  )
}
