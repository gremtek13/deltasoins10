import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { formatDate, dateRelative, comptesParMois } from '../lib/format'
import type { Piece } from '../lib/types'
import KpiTile from '../components/widgets/KpiTile'
import Widget from '../components/widgets/Widget'
import Avatar from '../components/widgets/Avatar'
import ProgressRing from '../components/widgets/ProgressRing'
import Sparkline from '../components/widgets/Sparkline'
import { IconCamera, IconDocuments, IconInformations, IconEstimation } from '../components/icons'

export default function ClientHome() {
  const { dossierIds, user, dossierActif } = useAuth()
  const dossierId = dossierIds[0]
  const [pieces, setPieces] = useState<Piece[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!dossierId) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data } = await supabase
        .from('pieces')
        .select('*')
        .eq('dossier_id', dossierId)
        .order('created_at', { ascending: false })
      setPieces(data ?? [])
    } catch (err) {
      console.error('Erreur chargement:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [dossierId])

  if (!dossierId) {
    return <p className="muted">Aucun dossier ne t'est encore rattaché — contacte JD Consult.</p>
  }

  const piecesAnnee = pieces.filter((p) => new Date(p.created_at).getFullYear() === new Date().getFullYear())
  const piecesValidees = piecesAnnee.filter((p) => p.statut === 'validee').length
  const piecesEnCours = piecesAnnee.filter((p) => p.statut === 'a_valider').length

  const datesCreation = pieces.map((p) => p.created_at)
  const tendanceDerniers12Mois = comptesParMois(datesCreation, 12)

  const derniersDepots = pieces.slice(0, 5)

  return (
    <>
      <div className="selecteur-societe">
        <label>Société</label>
        <select disabled>
          <option>{dossierActif?.nom || 'Mon dossier'}</option>
        </select>
      </div>

      <section className="client-hero">
        <span className="client-hero-date">{formatDate(new Date().toISOString()).split(' ')[0]}</span>
        <h1>Bonjour {user?.user_metadata?.nom?.split(' ')[0] || 'Utilisateur'} 👋</h1>
        <p className="client-hero-sous">Ton espace pour {dossierActif?.nom || 'ton dossier'} — dépose, on s'occupe du reste.</p>
      </section>

      <div className="tuiles">
        <label className="tuile tuile-principale">
          <span className="tuile-icone"><IconCamera width={24} height={24} /></span>
          <span className="tuile-libelle">Prendre une photo</span>
          <span className="tuile-desc">Une facture, un reçu : photographie-le, il est reconnu et classé tout seul.</span>
          <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => { e.target.files?.[0] && alert('Photo non encore intégrée') }} />
        </label>
        <a href="#/mes-pieces" className="tuile">
          <span className="tuile-icone"><IconDocuments width={24} height={24} /></span>
          <span className="tuile-libelle">Mes pièces</span>
          <span className="tuile-desc">Dépose des fichiers et vois ce qu'il manque encore à ton dossier.</span>
        </a>
        <a href="#" className="tuile">
          <span className="tuile-icone"><IconInformations width={24} height={24} /></span>
          <span className="tuile-libelle">Mes informations</span>
          <span className="tuile-desc">Véhicule, titres-restaurant, chèques-vacances… à renseigner une fois.</span>
        </a>
        <a href="#" className="tuile">
          <span className="tuile-icone"><IconEstimation width={24} height={24} /></span>
          <span className="tuile-libelle">Ma simulation</span>
          <span className="tuile-desc">Une estimation de tes charges sociales à partir de tes chiffres.</span>
        </a>
      </div>

      {loading ? (
        <div className="bento">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="span-3 skeleton" style={{ height: 172 }} />
          ))}
        </div>
      ) : (
        <>
          <div className="bento">
            <div className="span-3">
              <KpiTile
                libelle="Envoyés en 2026"
                valeur={piecesAnnee.length}
                detail="factures et documents"
                delta={{ texte: `+${Math.max(0, (tendanceDerniers12Mois[11] || 0) - (tendanceDerniers12Mois[10] || 0))} vs mois dernier`, positif: true }}
                tendance={tendanceDerniers12Mois}
              />
            </div>
            <div className="span-3">
              <KpiTile
                libelle="En cours de vérification"
                valeur={piecesEnCours}
                detail="ton comptable s'en occupe"
              />
            </div>
            <div className="span-3">
              <KpiTile
                libelle="Relevés 2026"
                valeur={<>6<small>/ 8</small></>}
                statut="warning"
                detail="2 mois à envoyer"
              />
            </div>
            <div className="span-3">
              <KpiTile
                libelle="Cotisations 2026"
                valeur={4}
                statut="ok"
                detail="échéances reçues"
              />
            </div>

            <Widget className="span-7" titre="Ce qu'il reste à envoyer" sousTitre="1 point(s) en attente de ta part" action={<ProgressRing ratio={2 / 3} statut="warning" taille={56} epaisseur={6} />} plein>
              <div>
                {[
                  ['Relevés bancaires 2026', 'Mois manquants : juillet, août', false],
                  ['Appels de cotisation 2026', '4 échéance(s) reçue(s)', true],
                  ['Factures et documents 2026', `${piecesAnnee.length} déposé(s) cette année`, true],
                ].map(([l, d, ok]) => (
                  <div key={String(l)} className="check-ligne">
                    <span className={`check-dot ${ok ? '' : 'check-manque'}`} />
                    <div className="check-ligne-corps">
                      <div className="check-ligne-libelle">{l}</div>
                      <div className="check-ligne-detail">{d}</div>
                    </div>
                    {!ok ? (
                      <a href="#/mes-pieces" className="btn btn-outline btn-sm">
                        Envoyer
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </Widget>

            <Widget className="span-5" titre="Mes derniers envois" sousTitre="Tout ce que tu as déposé arrive ici" action={<a href="#/mes-pieces" className="btn btn-outline btn-sm">Tout voir</a>} plein>
              <div className="feed">
                {derniersDepots.length === 0 ? (
                  <div className="empty-state">Aucun dépôt pour l'instant.</div>
                ) : (
                  derniersDepots.map((p) => (
                    <a key={p.id} href="#/mes-pieces" className="feed-item">
                      <span className="feed-icone"><IconDocuments width={16} height={16} /></span>
                      <div className="feed-texte">
                        <strong>{p.statut === 'validee' ? 'Facture traitée' : 'Facture en cours de vérification'}</strong>
                        <span className="feed-fichier">{p.nom_fichier}</span>
                      </div>
                      <span className="feed-date">{dateRelative(p.created_at)}</span>
                    </a>
                  ))
                )}
              </div>
            </Widget>
          </div>

          <div className="widget">
            <header className="widget-entete">
              <div>
                <h3 className="widget-titre">Comment ça marche</h3>
                <p className="widget-sous-titre">Trois étapes, rien à trier de ton côté.</p>
              </div>
              <div className="widget-action">
                <button className="btn btn-outline btn-sm">Compris</button>
              </div>
            </header>
            <div className="widget-corps">
              <div className="etapes">
                {[
                  ['Dépose tes fichiers', 'Factures, reçus, relevés, appels de cotisation — sans trier.'],
                  ["C'est reconnu automatiquement", 'Chaque fichier est analysé et classé dès l\'envoi.'],
                  ['Suis ce qu\'il reste', 'La checklist dans "Mes pièces" te dit ce qui manque.'],
                ].map(([t, d], i) => (
                  <div key={t} className="etape">
                    <span className="etape-num">{i + 1}</span>
                    <div>
                      <div className="etape-titre">{t}</div>
                      <div className="etape-desc">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
