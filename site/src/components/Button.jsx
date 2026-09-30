import Magnetic from './Magnetic'
import { scrollTo } from '../lib/motion'

// Pill button. The gold fill rises from below on hover; label rolls over.
export default function Button({ children, href, onClick, variant = 'gold', type = 'button', className = '' }) {
  const handle = (e) => {
    if (href?.startsWith('#')) {
      e.preventDefault()
      scrollTo(href)
    }
    onClick?.(e)
  }
  const base =
    'group relative inline-flex h-14 items-center overflow-hidden rounded-full px-8 text-[0.78rem] font-medium uppercase tracking-[0.22em] transition-colors duration-700'
  const look =
    variant === 'gold'
      ? 'border border-gold/70 text-gold-soft hover:text-ink'
      : 'border border-moon/25 text-moon hover:text-ink'
  const inner = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 translate-y-[101%] rounded-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 ${
          variant === 'gold' ? 'bg-gold' : 'bg-moon'
        }`}
      />
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">{children}</span>
        <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
    </>
  )
  return (
    <Magnetic>
      {href ? (
        <a href={href} onClick={handle} className={`${base} ${look} ${className}`}>
          {inner}
        </a>
      ) : (
        <button type={type} onClick={handle} className={`${base} ${look} ${className}`}>
          {inner}
        </button>
      )}
    </Magnetic>
  )
}
