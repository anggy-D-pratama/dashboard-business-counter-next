export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '')
  return null
}

export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === 'undefined') return
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `; expires=${date.toUTCString()}`
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`
}

export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`
}
