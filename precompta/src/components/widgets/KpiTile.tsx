import { ReactNode } from 'react'
import Sparkline from './Sparkline'

export type KpiStatut = 'ok' | 'warning' | 'danger'

export default function KpiTile({
  libelle,
  valeur,
  statut = 'ok',
  detail,
  delta,
  tendance,
  onClick,
}: {
  libelle: string
  valeur: string | number | ReactNode
  statut?: KpiStatut
  detail?: string
  delta?: { texte: string; positif: boolean }
  tendance?: number[]
  onClick?: () => void
}) {
  const statusColor = {
    ok: 'var(--color-primary)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
  }

  return (
    <div className={`kpi-tile kpi-${statut}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="kpi-header">
        <h3 className="kpi-libelle">{libelle}</h3>
        <span className="kpi-dot" style={{ background: statusColor[statut] }} />
      </div>
      <div className="kpi-body">
        <div className="kpi-valeur">{valeur}</div>
        {tendance && <Sparkline points={tendance} taille={48} hauteur={20} />}
      </div>
      {(detail || delta) && (
        <div className="kpi-footer">
          {delta && <div className="kpi-delta" style={{ color: delta.positif ? 'var(--color-primary)' : 'var(--color-danger)' }}>
            {delta.positif ? '↑' : '↓'} {delta.texte}
          </div>}
          {detail && <div className="kpi-detail">{detail}</div>}
        </div>
      )}
    </div>
  )
}
