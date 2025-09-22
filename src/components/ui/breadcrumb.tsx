import React from 'react'
import { Link } from 'react-router'
import { Button } from './button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbProps {
  to: string
  label: string
  className?: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  to, 
  label, 
  className 
}) => {
  return (
    <Button asChild variant="ghost" className={cn("hover:bg-transparent", className)}>
      <Link to={to} className="flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    </Button>
  )
}
