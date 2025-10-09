import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbProps {
  to: string
  label: string
  className?: string
  useHistory?: boolean
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  to, 
  label, 
  className,
  useHistory = true
}) => {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    if (useHistory && window.history.state?.idx > 0) {
      e.preventDefault()
      navigate(-1)
    }
  }

  return (
    <Button asChild variant="ghost" className={cn("hover:bg-transparent", className)}>
      <Link to={to} onClick={handleClick} className="flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    </Button>
  )
}
