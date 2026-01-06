'use client'

import { useState, useEffect } from 'react'
import type { Boss } from '@/app/types/boss'
import { TYPE_LABELS, TYPE_COLORS } from '@/app/constants/boss'
import {
  formatRespawnTime,
  formatDateTime,
  formatCountdown
} from '@/app/utils/format'

interface BossCardProps {
  boss: Boss
  onReportKill: (boss: Boss) => void
  onEditKill: (boss: Boss) => void
}

export function BossCard({ boss, onReportKill, onEditKill }: BossCardProps) {
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
    ? formatDateTime(boss.respawnTime)
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
              <button
                className="edit-btn"
                title="修改"
                onClick={() => onEditKill(boss)}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
