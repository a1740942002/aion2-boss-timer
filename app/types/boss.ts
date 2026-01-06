export type BossType = 'RARE' | 'LEGACY' | 'UNIQUE'

export interface Boss {
  id: number
  name: string
  teleportPoint: string
  type: BossType
  respawnHours: number
  specialDrop: boolean
  deathTime: string | null
  reporter: string | null
  respawnTime: string | null
  timeRemaining: number | null
}

