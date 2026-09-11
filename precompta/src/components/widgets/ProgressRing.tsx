export type ProgressRingStatut = 'ok' | 'warning' | 'danger'

export default function ProgressRing({
  ratio,
  taille = 64,
  epaisseur = 5,
  statut = 'ok',
}: {
  ratio: number
  taille?: number
  epaisseur?: number
  statut?: ProgressRingStatut
}) {
  const rayon = (taille - epaisseur) / 2
  const circonference = 2 * Math.PI * rayon
  const offset = circonference * (1 - Math.min(1, Math.max(0, ratio)))

  const colorMap = {
    ok: 'var(--color-primary)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
  }

  const pourcent = Math.round(ratio * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={taille} height={taille} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={taille / 2} cy={taille / 2} r={rayon} fill="none" stroke="var(--color-gray-200)" strokeWidth={epaisseur} />
        <circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          fill="none"
          stroke={colorMap[statut]}
          strokeWidth={epaisseur}
          strokeDasharray={circonference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
        {pourcent}%
      </div>
    </div>
  )
}
