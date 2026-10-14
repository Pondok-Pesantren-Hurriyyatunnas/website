import { Crest } from './Crest'

// Ditampilkan di halaman login dashboard (menggantikan logo Payload)
export function AdminLogo() {
  return (
    <div className="ponpes-logo">
      <Crest size={72} />
      <div>
        <div className="ponpes-logo__title">Hurriyyatunnas Bakti Awo</div>
        <div className="ponpes-logo__subtitle">Dashboard Admin</div>
      </div>
    </div>
  )
}
