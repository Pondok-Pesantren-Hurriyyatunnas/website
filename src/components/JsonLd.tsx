// Data terstruktur (schema.org) supaya Google memahami isi halaman, mis. untuk panel info di hasil pencarian
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" supaya isi dari dashboard tidak bisa menutup tag <script>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
