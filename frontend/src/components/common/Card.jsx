export default function Card({ children, className = '', as: Element = 'section' }) {
  return <Element className={`surface-card ${className}`.trim()}>{children}</Element>
}