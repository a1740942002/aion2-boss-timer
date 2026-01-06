'use client'

import { useState, useEffect, useCallback } from 'react'

type BossType = 'RARE' | 'LEGACY' | 'UNIQUE'

interface Boss {
  id: number
  name: string
  teleportPoint: string
  type: BossType
  respawnHours: number
  deathTime: string | null
  reporter: string | null
  respawnTime: string | null
  timeRemaining: number | null
}

const TYPE_LABELS: Record<BossType, string> = {
  RARE: '稀有',
  LEGACY: '傳承',
  UNIQUE: '獨特'
}

const TYPE_COLORS: Record<BossType, string> = {
  RARE: 'bg-emerald-500 text-white',
  LEGACY: 'bg-blue-500 text-white',
  UNIQUE: 'bg-yellow-400 text-black'
}

function formatRespawnTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}分鐘`
  }
  return `${hours}小時`
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const time = date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  if (isToday) return `今天 ${time}`
  if (isYesterday) return `昨天 ${time}`
  return `${date.getMonth() + 1}/${date.getDate()} ${time}`
}

function formatCountdown(ms: number): {
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

function BossCard({
  boss,
  onReportKill
}: {
  boss: Boss
  onReportKill: (boss: Boss) => void
}) {
  const [timeRemaining, setTimeRemaining] = useState(boss.timeRemaining)

  useEffect(() => {
    if (boss.respawnTime) {
      const interval = setInterval(() => {
        const remaining = new Date(boss.respawnTime!).getTime() - Date.now()
        setTimeRemaining(remaining)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [boss.respawnTime])

  const countdown =
    timeRemaining !== null ? formatCountdown(timeRemaining) : null
  const respawnTimeFormatted = boss.respawnTime
    ? new Date(boss.respawnTime).toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    : null

  // Determine if the respawn time is "accurate" or "estimated"
  // For this demo, we consider times with known deathTime as accurate
  const isAccurate = boss.deathTime !== null

  return (
    <div className="boss-card">
      <div className="boss-info">
        <div className="boss-header">
          <h3 className="boss-name">{boss.name}</h3>
          <span className={`boss-type ${TYPE_COLORS[boss.type]}`}>
            {TYPE_LABELS[boss.type]}
          </span>
          <button className="history-btn" title="查看歷史">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </button>
        </div>
        <div className="boss-details">
          <span className="boss-location">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {boss.teleportPoint}
          </span>
          <span className="boss-respawn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            {formatRespawnTime(boss.respawnHours)}
          </span>
        </div>
      </div>

      <div className="kill-info">
        {boss.deathTime ? (
          <>
            <div className="kill-time">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              {formatDateTime(boss.deathTime)}
            </div>
            <div className="reporter">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {boss.reporter || '匿名'}
              <button className="undo-btn" title="撤銷">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="no-data">尚無回報</div>
        )}
      </div>

      <div className="timer-section">
        {countdown ? (
          <>
            <div
              className={`countdown ${countdown.isNegative ? 'negative' : ''}`}
            >
              <span className="time-value">{countdown.hours}</span>
              <span className="time-separator">:</span>
              <span className="time-value">{countdown.minutes}</span>
              <span className="time-separator small">:</span>
              <span className="time-value small">{countdown.seconds}</span>
            </div>
            <div className="respawn-estimate">
              <span className="estimate-time">{respawnTimeFormatted}</span>
              <span
                className={`estimate-badge ${
                  isAccurate ? 'accurate' : 'estimated'
                }`}
              >
                {isAccurate ? '準確' : '推算'}
              </span>
            </div>
            {countdown.isNegative && (
              <div className="missed-count">
                已錯過{' '}
                {Math.ceil(
                  Math.abs(timeRemaining!) /
                    (boss.respawnHours * 60 * 60 * 1000)
                )}{' '}
                次復活
              </div>
            )}
          </>
        ) : (
          <div className="no-timer">--:--:--</div>
        )}
      </div>

      <button className="report-btn" onClick={() => onReportKill(boss)}>
        報告擊殺
      </button>
    </div>
  )
}

function ReportModal({
  boss,
  onClose,
  onSubmit
}: {
  boss: Boss
  onClose: () => void
  onSubmit: (reporter: string, deathTime: string) => void
}) {
  const [reporter, setReporter] = useState('')
  const [deathTime, setDeathTime] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(reporter, deathTime)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>報告擊殺</h2>
        <p className="modal-boss-name">{boss.name}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>回報者</label>
            <input
              type="text"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              placeholder="輸入你的名字"
            />
          </div>
          <div className="form-group">
            <label>擊殺時間</label>
            <input
              type="datetime-local"
              value={deathTime}
              onChange={(e) => setDeathTime(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="submit-btn">
              確認
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const BOSS_TYPE_ORDER: BossType[] = ['RARE', 'LEGACY', 'UNIQUE']

const TYPE_HEADER_COLORS: Record<BossType, string> = {
  RARE: 'rare-header',
  LEGACY: 'legacy-header',
  UNIQUE: 'unique-header'
}

export default function Home() {
  const [bosses, setBosses] = useState<Boss[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null)

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
      fetchBosses()
    } catch (error) {
      console.error('Failed to report kill:', error)
    }
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
                  onReportKill={setSelectedBoss}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {selectedBoss && (
        <ReportModal
          boss={selectedBoss}
          onClose={() => setSelectedBoss(null)}
          onSubmit={handleReportKill}
        />
      )}
    </div>
  )
}
