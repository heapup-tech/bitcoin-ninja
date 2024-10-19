import KaTeX from 'katex'
import React, { PropsWithChildren, useMemo } from 'react'

const createMathComponent = (
  Component: React.FC<{ html: string }>,
  { displayMode }: { displayMode: boolean }
) => {
  const MathComponent = ({
    children,
    errorColor,
    math,
    renderError
  }: PropsWithChildren<{
    errorColor?: string
    math?: string
    renderError?: (error: Error) => React.ReactNode
  }>) => {
    const formula = math ?? children

    const { html, error } = useMemo(() => {
      try {
        const html = KaTeX.renderToString(formula, {
          displayMode,
          errorColor,
          throwOnError: !!renderError
        })

        return { html, error: undefined }
      } catch (error) {
        if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
          return { error }
        }
        throw error
      }
    }, [formula, errorColor, renderError])

    if (error as Error) {
      return renderError ? (
        // @ts-ignore
        renderError(error)
      ) : (
        // @ts-ignore
        <Component html={`${error.message}`} />
      )
    }

    return <Component html={html} />
  }

  return MathComponent
}

const InternalBlockMath = ({ html }: { html: string }) => {
  return (
    <div
      data-testid='react-katex'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

const InternalInlineMath = ({ html }: { html: string }) => {
  return (
    <span
      data-testid='react-katex'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export const BlockMath = createMathComponent(InternalBlockMath, {
  displayMode: true
})
export const InlineMath = createMathComponent(InternalInlineMath, {
  displayMode: false
})
