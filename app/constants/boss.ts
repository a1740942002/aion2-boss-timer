import type { BossType } from '@/app/types/boss'

export const TYPE_LABELS: Record<BossType, string> = {
  RARE: '稀有',
  LEGACY: '傳承',
  UNIQUE: '獨特'
}

export const TYPE_COLORS: Record<BossType, string> = {
  RARE: 'bg-emerald-500 text-white',
  LEGACY: 'bg-blue-500 text-white',
  UNIQUE: 'bg-yellow-400 text-black'
}

export const TYPE_HEADER_COLORS: Record<BossType, string> = {
  RARE: 'rare-header',
  LEGACY: 'legacy-header',
  UNIQUE: 'unique-header'
}

export const BOSS_TYPE_ORDER: BossType[] = ['RARE', 'LEGACY', 'UNIQUE']

