import * as React from 'react'
import { cn } from '@/lib/utils/index'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'box-border flex flex-row justify-start items-center p-5 overflow-hidden content-center flex-nowrap gap-6 rounded-[20px]',
      className
    )}
    style={{
      background: 'rgba(250, 251, 252, 0.82)', // Neutral gray-tinted white
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(220, 225, 230, 0.4)',
      borderTop: '2px solid rgba(245, 248, 250, 0.9)',
      boxShadow: `
        0px 0.7065919983928324px 0.7065919983928324px -0.6666666666666666px rgba(0, 0, 0, 0.08),
        0px 1.8065619053231785px 1.8065619053231785px -1.3333333333333333px rgba(0, 0, 0, 0.08),
        0px 3.6217592146567767px 3.6217592146567767px -2px rgba(0, 0, 0, 0.07),
        0px 6.8655999097303715px 6.8655999097303715px -2.6666666666666665px rgba(0, 0, 0, 0.07),
        0px 13.646761411524492px 13.646761411524492px -3.3333333333333335px rgba(0, 0, 0, 0.05),
        0px 30px 30px -4px rgba(0, 0, 0, 0.02),
        inset 0px 3px 1px 0px rgba(255, 255, 255, 0.5)
      `
    }}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-tight tracking-tight text-foreground',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}