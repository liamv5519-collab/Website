import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

// Gold dot that tracks the pointer exactly, and a silver ring that floats
// behind it. The ring swells over anything interactive and labels imagery.
export default function Cursor() {
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [mode, setMode] = useState('default') // default | hover | view
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 140, damping: 20, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 140, damping: 20, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target.closest?.('[data-cursor], a, button, input, select, textarea, label')
      if (!t) {
        setMode('default')
        setLabel('')
      } else if (t.dataset.cursor === 'view') {
        setMode('view')
        setLabel(t.dataset.cursorLabel || 'View')
      } else {
        setMode('hover')
        setLabel('')
      }
    }
    const leave = () => {
      x.set(-100)
      y.set(-100)
    }
    const press = () => setDown(true)
    const release = () => setDown(false)
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled, x, y])

  if (!enabled) return null

  const size = mode === 'view' ? 92 : mode === 'hover' ? 58 : 34
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          scale: down ? 0.85 : 1,
          backgroundColor: mode === 'view' ? 'rgba(201,164,92,0.92)' : 'rgba(201,164,92,0)',
          borderColor: mode === 'default' ? 'rgba(223,227,236,0.45)' : 'rgba(201,164,92,0.9)',
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      >
        <span className="absolute inset-0 rounded-full border" style={{ borderColor: 'inherit' }} />
        <motion.span
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink"
          animate={{ opacity: mode === 'view' ? 1 : 0 }}
        >
          {label}
        </motion.span>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-[6px] w-[6px] rounded-full bg-gold"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: mode === 'view' ? 0 : 1, scale: mode === 'hover' ? 0.5 : 1 }}
      />
    </>
  )
}
