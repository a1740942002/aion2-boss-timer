'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Boss, BossType } from '@/app/types/boss'
import {
  TYPE_LABELS,
  TYPE_HEADER_COLORS,
  BOSS_TYPE_ORDER
} from '@/app/constants/boss'
import { BossCard } from '@/app/components/BossCard'
import { ReportModal } from '@/app/components/ReportModal'

export default function Home() {
  const [bosses, setBosses] = useState<Boss[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const fetchBosses = useCallback(async () => {
    try {
      const res = await fetch('/api/bosses')
      const data = await res.json()
      setBosses(data)
    } catch (error) {
      console.error('Failed to fetch bosses:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBosses()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchBosses, 30000)
    return () => clearInterval(interval)
  }, [fetchBosses])

  const handleReportKill = async (reporter: string, deathTime: string) => {
    if (!selectedBoss) return

    try {
      await fetch(`/api/bosses/${selectedBoss.id}/kill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporter, deathTime })
      })
      setSelectedBoss(null)
      setIsEditMode(false)
      fetchBosses()
    } catch (error) {
      console.error('Failed to report kill:', error)
    }
  }

  const handleOpenReportModal = (boss: Boss) => {
    setSelectedBoss(boss)
    setIsEditMode(false)
  }

  const handleOpenEditModal = (boss: Boss) => {
    setSelectedBoss(boss)
    setIsEditMode(true)
  }

  const handleCloseModal = () => {
    setSelectedBoss(null)
    setIsEditMode(false)
  }

  // Group bosses by type
  const bossesByType = BOSS_TYPE_ORDER.reduce((acc, type) => {
    acc[type] = bosses.filter((boss) => boss.type === type)
    return acc
  }, {} as Record<BossType, Boss[]>)

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>載入中...</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AION 首領計時器</h1>
        <p>追蹤首領重生時間</p>
      </header>

      <main className="boss-columns">
        {BOSS_TYPE_ORDER.map((type) => (
          <section key={type} className="boss-column">
            <h2 className={`column-header ${TYPE_HEADER_COLORS[type]}`}>
              {TYPE_LABELS[type]}
              <span className="boss-count">{bossesByType[type].length}</span>
            </h2>
            <div className="boss-list">
              {bossesByType[type].map((boss) => (
                <BossCard
                  key={boss.id}
                  boss={boss}
                  onReportKill={handleOpenReportModal}
                  onEditKill={handleOpenEditModal}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {selectedBoss && (
        <ReportModal
          boss={selectedBoss}
          isEditMode={isEditMode}
          onClose={handleCloseModal}
          onSubmit={handleReportKill}
        />
      )}
    </div>
  )
}
