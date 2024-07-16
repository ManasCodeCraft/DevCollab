import React from 'react'
import { Button } from 'react-bootstrap'

export default function ButtonWithLoading({variant, buttonSize, loading, onLoading, children, onClick, className}) {
  return (
    loading ? (
        <Button variant={variant || "primary"} size={buttonSize || 'md'} className={className} disabled>
          {onLoading || 'Working on it...'}
        </Button>
      ) : (
        <Button variant="primary" size={buttonSize} onClick={onClick} className={className} >
           {children}
        </Button>
      )
  )
}
