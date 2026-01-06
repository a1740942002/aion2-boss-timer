export function formatRespawnTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}分鐘`
  }
  return `${hours}小時`
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

export function formatCountdown(ms: number): {
  hours: string
  minutes: string
  seconds: string
  isNegative: boolean
} {
  const isNegative = ms < 0
  const absMs = Math.abs(ms)
  const totalSeconds = Math.floor(absMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    isNegative
  }
}

