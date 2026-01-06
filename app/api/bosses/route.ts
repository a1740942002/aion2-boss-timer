import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const bosses = await prisma.boss.findMany({
      orderBy: [{ deathTime: 'desc' }, { name: 'asc' }]
    })

    // Calculate respawn time and sort by time remaining
    const bossesWithRespawn = bosses.map((boss) => {
      let respawnTime: Date | null = null
      let timeRemaining: number | null = null

      if (boss.deathTime) {
        respawnTime = new Date(
          boss.deathTime.getTime() + boss.respawnHours * 60 * 60 * 1000
        )
        timeRemaining = respawnTime.getTime() - Date.now()
      }

      return {
        ...boss,
        respawnTime,
        timeRemaining
      }
    })

    // Sort: bosses with known respawn time first (by time remaining), then unknown
    bossesWithRespawn.sort((a, b) => {
      if (a.timeRemaining !== null && b.timeRemaining !== null) {
        return a.timeRemaining - b.timeRemaining
      }
      if (a.timeRemaining !== null) return -1
      if (b.timeRemaining !== null) return 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(bossesWithRespawn)
  } catch (error) {
    console.error('Failed to fetch bosses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bosses' },
      { status: 500 }
    )
  }
}
