// src/telegram.ts

export function getWebApp() {
  if (typeof window === 'undefined') return null
  return (window as any).Telegram?.WebApp ?? null
}
