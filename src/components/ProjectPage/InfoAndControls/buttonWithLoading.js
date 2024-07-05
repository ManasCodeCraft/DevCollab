import React from 'react'
import { Button } from 'react-bootstrap'

export default function ButtonWithLoading({variant, buttonSize, loading, onLoading, children, onClick}) {
  return (
    loading ? (
        <Button variant={variant || "primary"} size={buttonSize} disabled>
          {onLoading || 'Working on it...'}
        </Button>
      ) : (
        <Button variant="primary" size={buttonSize} onClick={onClick}>
           {children}
        </Button>
      )
  )
}
