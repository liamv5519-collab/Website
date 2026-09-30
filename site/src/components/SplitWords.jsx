// Renders text as masked words so GSAP can lift each one into view.
export default function SplitWords({ text, className = '', wordClass = '' }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="split-word">
          <span className={wordClass}>{w}</span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
