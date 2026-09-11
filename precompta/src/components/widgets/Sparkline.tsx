export default function Sparkline({ points, taille = 64, hauteur = 24 }: { points: number[]; taille?: number; hauteur?: number }) {
  if (points.length === 0) return null

  const max = Math.max(...points)
  const min = Math.min(...points)
  const plage = max - min || 1

  const w = taille
  const h = hauteur
  const padding = 4

  const coords = points.map((p, i) => ({
    x: padding + (i / (points.length - 1)) * (w - 2 * padding),
    y: h - padding - ((p - min) / plage) * (h - 2 * padding),
  }))

  const current = points[points.length - 1]
  const currentY = h - padding - ((current - min) / plage) * (h - 2 * padding)

  const pathData = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
  const areaData = `${pathData} L ${coords[coords.length - 1].x} ${h} L ${coords[0].x} ${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={taille} height={hauteur} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0.15 }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={areaData} fill="url(#sparkline-gradient)" />
      <path d={pathData} stroke="var(--color-gray-400)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1].x} cy={currentY} r="3" fill="var(--color-primary)" />
    </svg>
  )
}
