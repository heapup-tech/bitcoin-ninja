import KaTeX from 'katex'

interface MathProps {
  formula: string

  errorColor?: string

  className?: string
}

export const BlockMath = ({
  formula,
  errorColor = '',
  className = ''
}: MathProps) => {
  const html = KaTeX.renderToString(formula, {
    displayMode: true,
    errorColor
  })

  return (
    <div
      data-testid='react-katex'
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export const InlineMath = ({
  formula,
  errorColor = '',
  className = ''
}: MathProps) => {
  const html = KaTeX.renderToString(formula, {
    displayMode: false,
    errorColor
  })

  return (
    <span
      data-testid='react-katex'
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
