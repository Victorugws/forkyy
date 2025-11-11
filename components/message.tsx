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

export function BotMessage({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(message || '')
  const processedData = preprocessLaTeX(message || '')
  
  const containerClass = cn(
    'box-border flex flex-col justify-center items-center p-5 bg-white/70 backdrop-blur-md overflow-hidden content-center flex-nowrap gap-6 rounded-[20px] w-full max-w-3xl mx-auto transition-transform duration-300 ease-in-out hover:scale-[1.015]',
    className
  )

  if (!message) {
    return (
      <div 
        className={containerClass}
        style={{
          boxShadow: `
            0px 0.7065919983928324px 0.7065919983928324px -0.6666666666666666px rgba(0, 0, 0, 0.08),
            0px 1.8065619053231785px 1.8065619053231785px -1.3333333333333333px rgba(0, 0, 0, 0.08),
            0px 3.6217592146567767px 3.6217592146567767px -2px rgba(0, 0, 0, 0.07),
            0px 6.8655999097303715px 6.8655999097303715px -2.6666666666666665px rgba(0, 0, 0, 0.07),
            0px 13.646761411524492px 13.646761411524492px -3.3333333333333335px rgba(0, 0, 0, 0.05),
            0px 30px 30px -4px rgba(0, 0, 0, 0.02),
            inset 0px 3px 1px 0px rgb(255, 255, 255)
          `
        }}
      >
        <p className="prose-sm text-muted-foreground">No content available</p>
      </div>
    )
  }

  const markdownProps = {
    className: 'prose-sm prose-neutral prose-a:text-accent-foreground/50',
    rehypePlugins: [[rehypeExternalLinks, { target: '_blank' }]],
    remarkPlugins: [remarkGfm],
    components: {
      code({ node, inline, className, children, ...props }) {
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
    <div 
      className={containerClass}
      style={{
        boxShadow: `
          0px 0.7065919983928324px 0.7065919983928324px -0.6666666666666666px rgba(0, 0, 0, 0.08),
          0px 1.8065619053231785px 1.8065619053231785px -1.3333333333333333px rgba(0, 0, 0, 0.08),
          0px 3.6217592146567767px 3.6217592146567767px -2px rgba(0, 0, 0, 0.07),
          0px 6.8655999097303715px 6.8655999097303715px -2.6666666666666665px rgba(0, 0, 0, 0.07),
          0px 13.646761411524492px 13.646761411524492px -3.3333333333333335px rgba(0, 0, 0, 0.05),
          0px 30px 30px -4px rgba(0, 0, 0, 0.02),
          inset 0px 3px 1px 0px rgb(255, 255, 255)
        `
      }}
    >
      <MemoizedReactMarkdown
        {...markdownProps}
        remarkPlugins={
          containsLaTeX ? [remarkGfm, remarkMath] : markdownProps.remarkPlugins
        }
        rehypePlugins={
          containsLaTeX
            ? [...markdownProps.rehypePlugins, [rehypeKatex]]
            : markdownProps.rehypePlugins
        }
      >
        {containsLaTeX ? processedData : message}
      </MemoizedReactMarkdown>
    </div>
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
