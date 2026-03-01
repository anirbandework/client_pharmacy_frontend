import React from 'react'
import { theme } from '../../styles/theme'

export const Input = ({ label, className = '', ...props }) => (
  <div>
    {label && <label className={theme.input.label}>{label}</label>}
    <input className={`${theme.input.base} ${className}`} {...props} />
  </div>
)

export const Button = ({ variant = 'primary', children, className = '', ...props }) => (
  <button className={`${theme.button[variant]} ${className}`} {...props}>
    {children}
  </button>
)

export const Alert = ({ type = 'info', children, className = '' }) => (
  <div className={`${theme.alert[type]} ${className}`}>
    {children}
  </div>
)

export const Card = ({ hover = false, children, className = '' }) => (
  <div className={`${hover ? theme.card.hover : theme.card.base} ${className}`}>
    {children}
  </div>
)

export const IconContainer = ({ variant = 'primary', children, className = '' }) => (
  <div className={`${theme.icon[variant]} ${className}`}>
    {children}
  </div>
)
