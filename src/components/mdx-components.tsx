import { CopyButton } from '@/components/copy-button'
import FileIcon from '@/components/file-icon'
import {
  Accordion,
  AccordionContent,
  AccordionItem
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import manifest from '@/lib/material-icon'
import { cn } from '@/lib/utils'
import '@/styles/admonition.css'
import '@/styles/mdx.css'
import { Info, Siren, Skull, TriangleAlert } from 'lucide-react'
import { useMDXComponent } from 'next-contentlayer/hooks'
import Link from 'next/link'

const components = {
  Accordion,
  AccordionContent,
  AccordionItem,
  Alert,
  AlertTitle,
  AlertDescription,
  admonition: ({
    className,
    __admonition_type__,
    __admonition_title__,
    ...props
  }: React.PropsWithChildren<{
    __admonition_type__: string
    __admonition_title__?: string
    className: string
  }>) => {
    let icon = <Info className='w-5 h-5' />
    if (__admonition_type__ === 'note') {
      icon = <Info className='w-5 h-5' />
    }
    if (__admonition_type__ === 'tip') {
      icon = <Siren className='w-5 h-5' />
    }
    if (__admonition_type__ === 'warning') {
      icon = <TriangleAlert className='w-5 h-5' />
    }
    if (__admonition_type__ === 'danger') {
      icon = <Skull className='w-5 h-5' />
    }

    return (
      <div className={className}>
        {__admonition_title__ && (
          <div className='flex gap-x-2 items-center'>
            {icon}
            <span>
              {Array.isArray(props.children)
                ? props.children[0]
                : props.children}
            </span>
          </div>
        )}

        <div className={cn(__admonition_title__ ? 'mt-2' : '')}>
          {Array.isArray(props.children) ? props.children.slice(1) : null}
        </div>
      </div>
    )
  },
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        'font-heading mt-2 scroll-m-20 text-4xl font-bold',
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        'font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        'mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  figcaption: async ({
    className,
    __rawString__,
    __language__,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & {
    __rawString__?: string
    __language__?: string
  }) => {
    const language = __language__ || ''
    const title = props.children || ''

    const extension =
      manifest?.fileNames?.[title.toString()] ||
      manifest?.fileExtensions?.[language] ||
      manifest?.fileNames?.[language] ||
      manifest?.languageIds?.[language] ||
      manifest.file!

    return (
      <div
        {...props}
        className={cn(className, 'border border-b-0')}
      >
        <div className='flex items-center'>
          <FileIcon
            extension={extension}
            className='w-5 h-5 mr-1.5'
          />
          {props.children}
        </div>

        {__rawString__ && (
          <CopyButton
            value={__rawString__}
            className={cn(
              'absolute right-4 top-4 text-zinc-500 dark:text-zinc-400'
            )}
          />
        )}
      </div>
    )
  },
  pre: ({
    className,
    __rawString__,
    __withTitle__,
    ...props
  }: React.HTMLAttributes<HTMLPreElement> & {
    __rawString__?: string
    __withTitle__?: boolean
  }) => {
    return (
      <>
        <pre
          className={cn(
            'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border  py-4 ',
            className,
            __withTitle__ && 'mt-0 rounded-tl-none rounded-tr-none'
          )}
          {...props}
        />

        {__rawString__ && !__withTitle__ && (
          <CopyButton
            value={__rawString__}
            className={cn(
              'absolute right-4 top-4 text-zinc-500 dark:text-zinc-400',
              __withTitle__ && 'top-16'
            )}
          />
        )}
      </>
    )
  },
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn(
        'font-medium underline underline-offset-4 text-primary',
        className
      )}
      target='_blank'
      {...props}
    ></a>
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-4', className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn('my-6 ml-6 list-disc', className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn('my-6 ml-6 list-decimal', className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <li
      className={cn('mt-2', className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn('mt-6 border-l-2 pl-4 italic font-medium', className)}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn('rounded-md', className)}
      alt={alt}
      {...props}
    />
  ),
  ImageCaption: ({
    className,
    src,
    caption,
    alt = '',
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    caption?: string
    alt?: string
  }) => (
    <div className='border rounded-lg mt-4'>
      <img
        className={cn('p-2 dark:invert', className)}
        src={src}
        alt={alt}
      />

      {caption && (
        <div className='p-2 bg-muted'>
          <div>{caption}</div>

          {props.children}
        </div>
      )}
    </div>
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className='my-4 md:my-8'
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className='my-6 w-full overflow-y-auto'>
      <table
        className={cn('w-full', className)}
        {...props}
      />
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={cn('border-b bg-muted', className)}
      {...props}
    />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn(
        'm-0 border-t p-0 hover:bg-muted/50 transition-all',
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border p-4 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        'border p-4 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm ',
        className
      )}
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      className={cn(
        'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  Steps: ({ ...props }) => (
    <div
      className='[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]'
      {...props}
    />
  ),
  Tabs: ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
    <Tabs
      className={cn('relative mt-6 w-full', className)}
      {...props}
    />
  ),
  TabsList: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn(
        'w-full justify-start rounded-none border-b bg-transparent p-0',
        className
      )}
      {...props}
    />
  ),
  TabsTrigger: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        'relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none',
        className
      )}
      {...props}
    />
  ),
  TabsContent: ({
    className,
    ...props
  }: React.ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn(
        'relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold',
        className
      )}
      {...props}
    />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn('font-medium underline underline-offset-4', className)}
      {...props}
    />
  ),
  LinkedCard: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        'flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10',
        className
      )}
      {...props}
    />
  )
}

interface MdxProps {
  code: string
}
export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code)

  return (
    <div className='mdx'>
      <Component components={components} />
    </div>
  )
}
