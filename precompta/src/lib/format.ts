export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9.]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

export function formatMoney(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '—'
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fr-FR')
}

export const CATEGORIE_LABELS: Record<string, string> = {
  achat: 'Achat',
  vente: 'Vente',
  note_frais: 'Note de frais',
  autre: 'Autre',
}

export function dateRelative(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'à l\'instant'
  if (diffHours === 0) return `il y a ${diffMins}m`
  if (diffHours === 1) return 'il y a 1h'
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays === 1) return 'hier'
  if (diffDays < 30) return `il y a ${diffDays}j`
  return formatDate(isoString)
}

export function comptesParMois(datesIso: string[], nbMois: number): number[] {
  const now = new Date()
  const mois = Array(nbMois)
    .fill(0)
    .map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (nbMois - 1 - i), 1)
      return d.getFullYear() * 100 + (d.getMonth() + 1)
    })

  const counts: Record<number, number> = {}
  datesIso.forEach((isoDate) => {
    const d = new Date(isoDate)
    const moisNum = d.getFullYear() * 100 + (d.getMonth() + 1)
    counts[moisNum] = (counts[moisNum] ?? 0) + 1
  })

  return mois.map((m) => counts[m] ?? 0)
}
