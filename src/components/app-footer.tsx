export default function AppFooter() {
  const year = new Date().getFullYear()
  return (
    <div className='flex h-24 items-center justify-center border-t border-border/40'>
      Copyright © {year} HeapUp
    </div>
  )
}
