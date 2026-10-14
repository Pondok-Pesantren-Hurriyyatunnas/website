/** Foto berbingkai lengkung mihrab; jika foto belum ada, tampil pola garis. */
export function ArchPhoto({
  src,
  alt,
  className = '',
}: {
  src?: string
  alt: string
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-t-full bg-[#e3ddc9] ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="stripes absolute inset-0" />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-t-full ring-1 ring-black/5 ring-inset" />
    </div>
  )
}
