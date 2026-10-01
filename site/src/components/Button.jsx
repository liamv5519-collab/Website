import { scrollTo } from '../lib/motion'

// Pill button: fills with colour on hover.
export default function Button({ children, href, onClick, variant = 'gold', type = 'button', disabled = false, className = '' }) {
  const handle = (e) => {
    if (href?.startsWith('#')) {
      e.preventDefault()
      scrollTo(href)
    }
    onClick?.(e)
  }
  const base =
    'inline-flex h-13 items-center rounded-full border px-7 text-[0.8rem] font-medium uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:opacity-60'
  const look =
    variant === 'gold'
      ? 'border-gold/80 text-gold-soft hover:bg-gold hover:text-ink'
      : 'border-moon/30 text-moon hover:bg-moon hover:text-ink'
  const cls = `${base} ${look} ${className}`
  return href ? (
    <a href={href} onClick={handle} className={cls}>
      {children}
    </a>
  ) : (
    <button type={type} onClick={handle} disabled={disabled} className={cls}>
      {children}
    </button>
  )
}
