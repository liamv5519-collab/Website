import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger, startSmoothScroll } from './lib/motion'
import Approach from './components/Approach'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Footer from './components/Footer'
import Hero from './components/Hero'
import LightShow from './components/LightShow'
import Manifesto from './components/Manifesto'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import Reporting from './components/Reporting'
import Statement from './components/Statement'

export default function App() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    startSmoothScroll()
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  const done = useCallback(() => {
    setReady(true)
    setTimeout(() => setLoading(false), 900)
  }, [])

  return (
    <>
      {loading && <Preloader onDone={done} />}
      <Cursor />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Statement />
        <LightShow />
        <Approach />
        <Reporting />
        <Manifesto />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </>
  )
}
