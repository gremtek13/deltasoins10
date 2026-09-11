import { ReactNode } from 'react'

export default function Widget({
  titre,
  sousTitre,
  action,
  children,
  plein,
  className,
}: {
  titre: string
  sousTitre?: string
  action?: ReactNode
  children: ReactNode
  plein?: boolean
  className?: string
}) {
  return (
    <div className={`widget ${className || ''}`}>
      {(titre || action) && (
        <header className="widget-entete">
          <div>
            <h3 className="widget-titre">{titre}</h3>
            {sousTitre && <p className="widget-sous-titre">{sousTitre}</p>}
          </div>
          {action && <div className="widget-action">{action}</div>}
        </header>
      )}
      <div className={`widget-corps ${plein ? 'plein' : ''}`}>{children}</div>
    </div>
  )
}
