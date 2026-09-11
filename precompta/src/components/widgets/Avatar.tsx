import { useMemo } from 'react'

export function initiales(nom: string): string {
  return nom
    .split(' ')
    .map((m) => m[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Avatar({ nom, taille = 40 }: { nom: string; taille?: number }) {
  const init = useMemo(() => initiales(nom), [nom])

  return (
    <div
      className="avatar"
      style={{
        width: taille,
        height: taille,
        fontSize: Math.round(taille / 2.2),
      }}
      title={nom}
    >
      {init}
    </div>
  )
}
