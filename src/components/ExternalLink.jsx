/** Externer Link mit Screenreader-Hinweis für neues Tab-Fenster. */
export default function ExternalLink({ href, children, className, ...props }) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
      <span className="visually-hidden"> (öffnet in neuem Tab)</span>
    </a>
  )
}
