/**
 * Encodes puzzle metadata into a base64url share key for clean URLs.
 */
export function encodeShareKey({ goalIndex, goalColor, r, g, b, y, config }) {
  const raw = `${goalIndex}-${goalColor}-${r}-${g}-${b}-${y}-${config}`
  return btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Decodes a base64url share key back into puzzle metadata.
 */
export function decodeShareKey(shareKey) {
  const padded = shareKey.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice(0, (4 - (shareKey.length % 4)) % 4)
  const raw = atob(padded)
  const [goalIndex, goalColor, r, g, b, y, config] = raw.split('-')
  return { goalIndex, goalColor, r, g, b, y, config }
}
