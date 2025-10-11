// client/src/components/ui/Input.tsx
import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className = '', ...props }: Props) {
  return (
    <input
      {...props}
      className={[
        // layout
        'w-full px-3 py-2 rounded-xl',
        // same subtle glass border as the mascot card
        'glass border border-black/10 dark:border-white/10',
        // calm placeholder + REMOVE blue ring
        'placeholder:opacity-60 focus:outline-none focus:ring-0 focus-visible:ring-0',
        // tiny contrast bump on focus, still neutral
        'focus:border-black/20 dark:focus:border-white/20',
        className,
      ].join(' ')}
    />
  )
}
