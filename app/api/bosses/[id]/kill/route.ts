import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { reporter, deathTime } = body

    const boss = await prisma.boss.update({
      where: { id: parseInt(id) },
      data: {
        deathTime: deathTime ? new Date(deathTime) : new Date(),
        reporter: reporter || '匿名'
      }
    })

    // Calculate respawn time
    const respawnTime = new Date(
      boss.deathTime!.getTime() + boss.respawnHours * 60 * 60 * 1000
    )
    const timeRemaining = respawnTime.getTime() - Date.now()

    return NextResponse.json({
      ...boss,
      respawnTime,
      timeRemaining
    })
  } catch (error) {
    console.error('Failed to report kill:', error)
    return NextResponse.json(
      { error: 'Failed to report kill' },
      { status: 500 }
    )
  }
}
