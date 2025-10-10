import type { InputHTMLAttributes } from 'react'
export default function Input({ className='', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`glass w-full px-3 py-2 rounded-xl outline-none focus-visible:ring-2 ring-accent ${className}`} {...props} />
}