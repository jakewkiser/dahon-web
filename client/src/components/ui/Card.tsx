export default function Card({ children, className='' }: { children: React.ReactNode, className?: string }) {
  return <div className={`glass rounded-2xl p-4 shadow-glow ${className}`}>{children}</div>
}