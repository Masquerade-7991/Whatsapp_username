import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground border-primary',
        secondary: 'bg-muted text-muted-foreground border-border',
        outline: 'bg-transparent text-foreground border-border',
        destructive: 'bg-destructive text-destructive-foreground border-destructive',
        success: 'bg-green-50 text-green-700 border-green-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), 'badge', className)} {...props} />
  )
}

export { Badge, badgeVariants }
