'use client'

import { SVGProps, useEffect, useState } from 'react'
import Image from 'next/image'

export default function FileIcon({
  extension,
  ...props
}: { extension: string } & SVGProps<SVGSVGElement>) {
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
      width={(props.width as number) || 16}
      height={(props.height as number) || 16}
      {...props}
    />
  )
}
