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

const SPECIAL_DROP_FILTER_KEY = 'aion-boss-timer-special-drop-filter'

export default function Home() {
  const [bosses, setBosses] = useState<Boss[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showSpecialDropOnly, setShowSpecialDropOnly] = useState(false)

  // Load filter preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SPECIAL_DROP_FILTER_KEY)
    if (saved !== null) {
      setShowSpecialDropOnly(saved === 'true')
    }
  }, [])

  const handleToggleSpecialDropFilter = () => {
    const newValue = !showSpecialDropOnly
    setShowSpecialDropOnly(newValue)
    localStorage.setItem(SPECIAL_DROP_FILTER_KEY, String(newValue))
  }

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

  const handleReportKill = async (
    reporter: string,
    deathTime: string | null
  ) => {
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

  const handleClearKill = async (boss: Boss) => {
    try {
      await fetch(`/api/bosses/${boss.id}/kill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporter: '', deathTime: null })
      })
      fetchBosses()
    } catch (error) {
      console.error('Failed to clear kill:', error)
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

  // Filter bosses based on special drop filter
  const filteredBosses = showSpecialDropOnly
    ? bosses.filter((boss) => boss.specialDrop)
    : bosses

  // Group bosses by type
  const bossesByType = BOSS_TYPE_ORDER.reduce((acc, type) => {
    acc[type] = filteredBosses.filter((boss) => boss.type === type)
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

      <div className="filter-bar">
        <button
          className={`filter-toggle ${showSpecialDropOnly ? 'active' : ''}`}
          onClick={handleToggleSpecialDropFilter}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          只顯示特殊掉落
        </button>
        {showSpecialDropOnly && (
          <span className="filter-count">
            顯示 {filteredBosses.length} / {bosses.length} 隻首領
          </span>
        )}
      </div>

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
                  onClearKill={handleClearKill}
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
