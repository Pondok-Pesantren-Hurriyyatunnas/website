// Lambang pondok (bulan sabit & bintang) untuk dashboard admin
export function Crest({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Lambang pondok">
      <circle cx="24" cy="24" r="23" fill="#165133" stroke="#c9a227" strokeWidth="2" />
      <path d="M27 11a13 13 0 1 0 10 21.5A11 11 0 1 1 27 11z" fill="#c9a227" />
      <path
        d="M33 14l1.3 3 3.2.3-2.4 2.1.7 3.1-2.8-1.6-2.8 1.6.7-3.1-2.4-2.1 3.2-.3z"
        fill="#ecd27f"
      />
    </svg>
  )
}
