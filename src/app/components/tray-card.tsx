import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { LucideIcon } from "lucide-react"

interface TrayCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children?: React.ReactNode
  footer?: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export function TrayCard({
  title,
  description,
  icon: Icon,
  children,
  footer,
  href,
  onClick,
  className,
}: TrayCardProps) {
  const content = (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )

  if (href) {
    return (
      <Link to={href} className="block transition-transform hover:scale-[1.02]">
        {content}
      </Link>
    )
  }

  if (onClick) {
    return (
      <div onClick={onClick} className="cursor-pointer transition-transform hover:scale-[1.02]">
        {content}
      </div>
    )
  }

  return content
}