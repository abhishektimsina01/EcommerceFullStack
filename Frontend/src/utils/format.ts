const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#ffe8d6"/><stop offset="1" stop-color="#f57224" stop-opacity="0.35"/>
      </linearGradient></defs>
      <rect width="400" height="400" fill="url(#g)"/>
      <text x="200" y="205" text-anchor="middle" fill="#9a3412" font-family="Arial" font-size="28" font-weight="700">ATO</text>
    </svg>`,
  )

export function resolveImageUrl(path?: string | null): string {
  if (!path) return PLACEHOLDER
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }
  const normalized = path.replace(/\\/g, '/')
  if (normalized.startsWith('/')) return normalized
  if (normalized.startsWith('uploads/')) return `/${normalized}`
  return `/uploads/${normalized.split('/').pop()}`
}

export function formatPrice(value: number) {
  return `Rs. ${Number(value).toLocaleString('en-NP')}`
}
