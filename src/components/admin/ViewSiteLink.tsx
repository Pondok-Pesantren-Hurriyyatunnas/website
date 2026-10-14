import { Crest } from './Crest'

// Kartu promo di bagian bawah menu samping: membuka website publik
export function ViewSiteLink() {
  return (
    <div className="ponpes-nav-card">
      <Crest size={32} />
      <p className="ponpes-nav-card__title">Website Pondok</p>
      <p className="ponpes-nav-card__text">Lihat hasil perubahan langsung di website.</p>
      <a href="/" target="_blank" rel="noopener" className="ponpes-nav-card__btn">
        Lihat Website ↗
      </a>
    </div>
  )
}
