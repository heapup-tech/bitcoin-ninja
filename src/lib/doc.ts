import { allDocs } from 'content-collections'

export interface DocPageProps {
  params: {
    slug: string[] | string
  }
}

export const getDocFromParams = async ({ params }: DocPageProps) => {
  let slug = params.slug

  if (Array.isArray(slug)) {
    slug = slug.join('/')
  }

  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) {
    return null
  }

  return doc
}
