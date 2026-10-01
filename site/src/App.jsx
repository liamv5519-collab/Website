import { useEffect } from 'react'
import { ScrollTrigger } from './lib/motion'
import Approach from './components/Approach'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Hero from './components/Hero'
import LightShow from './components/LightShow'
import Manifesto from './components/Manifesto'
import Nav from './components/Nav'
import Reporting from './components/Reporting'
import Statement from './components/Statement'

export default function App() {
  // Re-measure pinned sections once images and fonts have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero />
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
