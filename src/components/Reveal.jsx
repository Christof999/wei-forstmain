// Sichtbarer Wrapper ohne initial versteckte Inhalte (SSR-/Barrierefreiheit-sicher).
export default function Reveal({ children, className, as = 'div', id }) {
  const Tag = as
  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  )
}
