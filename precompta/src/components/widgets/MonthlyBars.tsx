import { useState } from 'react'

interface MoisData {
  mois: string
  encaissements: number
  decaissements: number
}

export default function MonthlyBars({ mois }: { mois: MoisData[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  if (!mois || mois.length === 0) return <p className="muted">Aucune donnée</p>

  const maxVal = Math.max(...mois.flatMap((m) => [m.encaissements, m.decaissements]))

  const noms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, background: 'var(--color-primary)', borderRadius: 2 }} />
          <span style={{ fontSize: '0.875rem' }}>Encaissements</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, background: 'var(--color-gray-300)', borderRadius: 2 }} />
          <span style={{ fontSize: '0.875rem' }}>Décaissements</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
        {mois.map((m) => {
          const moisNum = parseInt(m.mois.split('-')[1], 10) - 1
          const nom = noms[moisNum] || '?'
          const hEnc = (m.encaissements / maxVal) * 100
          const hDec = (m.decaissements / maxVal) * 100

          return (
            <div
              key={m.mois}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHovered(m.mois)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ width: '100%', height: 80, display: 'flex', alignItems: 'flex-end', gap: 2, justifyContent: 'center' }}>
                <div
                  style={{
                    flex: 1,
                    height: `${hEnc}%`,
                    background: 'var(--color-primary)',
                    borderRadius: '2px 2px 0 0',
                    opacity: hovered === m.mois ? 1 : 0.7,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: `${hDec}%`,
                    background: 'var(--color-gray-300)',
                    borderRadius: '2px 2px 0 0',
                    opacity: hovered === m.mois ? 1 : 0.7,
                  }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{nom}</span>
              {hovered === m.mois && (
                <div
                  style={{
                    position: 'absolute',
                    background: 'var(--color-surface-secondary)',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    border: '1px solid var(--color-border)',
                    zIndex: 10,
                    marginTop: -10,
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{nom}</div>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>+{m.encaissements.toLocaleString('fr-FR')}</div>
                  <div style={{ color: 'var(--color-gray-600)', fontWeight: 600 }}>−{m.decaissements.toLocaleString('fr-FR')}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
