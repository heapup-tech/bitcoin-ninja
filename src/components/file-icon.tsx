'use client'

import { SVGProps, useEffect, useState } from 'react'
import Image from 'next/image'

export default function FileIcon({
  extension,
  ...props
}: { extension: string } & Omit<
  React.ComponentProps<typeof Image>,
  'src' | 'alt'
>) {
  const [iconSrc, setIconSrc] = useState<string | null>(null)

  useEffect(() => {
    import(`material-icon-theme/icons/${extension}.svg`)
      .then((mod) => {
        console.log(mod)

        // Handle both string paths and component imports
        const src =
          typeof mod.default === 'string' ? mod.default : mod.default.src
        setIconSrc(src)
      })
      .catch(() => setIconSrc(null))
  }, [extension])

  if (!iconSrc) return null

  return (
    <Image
      src={iconSrc}
      alt={`${extension} icon`}
      {...props}
    />
  )
}
