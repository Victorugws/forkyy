'use client'
import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Citing } from './custom-link'
import { CodeBlock } from './ui/codeblock'
import { MemoizedReactMarkdown } from './ui/markdown'
import { DottedBorderCard } from './ui/dotted-border-card'

export function BotMessage({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  // Remove <has_function_call> tags before processing
  const cleanedMessage = (message || '').replace(/<has_function_call>[\s\S]*?<\/has_function_call>/gi, '').trim()
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(cleanedMessage || '')
  const processedData = preprocessLaTeX(cleanedMessage || '')
  
  const containerClass = cn(
    'box-border flex flex-col justify-center items-center overflow-hidden content-center flex-nowrap gap-6 w-full max-w-5xl mx-auto transition-transform duration-300 ease-in-out hover:scale-[1.015]',
    className
  )

  if (!cleanedMessage) {
    return (
      <DottedBorderCard 
        className={containerClass}
        borderRadius="1.5rem"
        padding="p-5"
      >
        <p className="prose-sm text-muted-foreground">No content available</p>
      </DottedBorderCard>
    )
  }

  const markdownProps = {
    className: 'prose-sm prose-neutral prose-a:text-accent-foreground/50',
    rehypePlugins: [[rehypeExternalLinks, { target: '_blank' }]],
    remarkPlugins: [remarkGfm],
    components: {
      code({ node, inline, className, children, ...props }: any) {
        if (children.length && children[0] == '▍') {
          return <span className="mt-1 cursor-default animate-pulse">▍</span>
        }

        if (children.length) {
          children[0] = (children[0] as string).replace('`▍`', '▍')
        }

        const match = /language-(\w+)/.exec(className || '')

        if (inline) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }

        return (
          <CodeBlock
            key={Math.random()}
            language={(match && match[1]) || ''}
            value={String(children).replace(/\n$/, '')}
            {...props}
          />
        )
      },
      a: Citing,
    },
  }

  return (
    <DottedBorderCard 
      className={containerClass}
      borderRadius="1.5rem"
      padding="p-5"
    >
      <MemoizedReactMarkdown
        {...markdownProps}
        remarkPlugins={
          containsLaTeX ? [remarkGfm, remarkMath] : markdownProps.remarkPlugins
        }
        rehypePlugins={
          containsLaTeX
            ? [...(markdownProps.rehypePlugins as any[]), [rehypeKatex] as any]
            : markdownProps.rehypePlugins
        }
      >
        {containsLaTeX ? processedData : cleanedMessage}
      </MemoizedReactMarkdown>
    </DottedBorderCard>
  )
}

const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  )
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  )
  return inlineProcessedContent
}
