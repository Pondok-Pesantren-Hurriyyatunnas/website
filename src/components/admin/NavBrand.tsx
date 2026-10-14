import Link from 'next/link'

import { Crest } from './Crest'

// Logo & nama pondok di bagian atas menu samping dashboard
export function NavBrand() {
  return (
    <Link href="/admin" className="ponpes-nav-brand">
      <Crest size={36} />
      <span>
        <strong>Hurriyyatunnas</strong>
        <small>Bakti Awo</small>
      </span>
    </Link>
  )
}
