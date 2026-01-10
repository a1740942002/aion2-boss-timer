'use client'

import { useState, useEffect } from 'react'
import type { Boss } from '@/app/types/boss'

const REPORTER_NAME_KEY = 'aion-boss-timer-reporter-name'

interface ReportModalProps {
  boss: Boss
  isEditMode?: boolean
  onClose: () => void
  onSubmit: (reporter: string, deathTime: string | null) => void
}

export function ReportModal({
  boss,
  isEditMode = false,
  onClose,
  onSubmit
}: ReportModalProps) {
  const [reporter, setReporter] = useState(() => {
    if (isEditMode && boss.reporter) {
      return boss.reporter
    }
    return ''
  })

  // Load saved reporter name from localStorage on mount (only for new reports)
  useEffect(() => {
    if (!isEditMode) {
      const savedName = localStorage.getItem(REPORTER_NAME_KEY)
      if (savedName) {
        setReporter(savedName)
      }
    }
  }, [isEditMode])
  const [deathTime, setDeathTime] = useState(() => {
    if (isEditMode && boss.deathTime) {
      const date = new Date(boss.deathTime)
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      return date.toISOString().slice(0, 19)
    }
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 19)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save reporter name to localStorage for future use
    if (reporter.trim()) {
      localStorage.setItem(REPORTER_NAME_KEY, reporter.trim())
    }
    // Convert datetime-local string to ISO string with timezone
    const localDate = new Date(deathTime)
    const isoString = localDate.toISOString()
    onSubmit(reporter, isoString)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? '修改回報' : '報告擊殺'}</h2>
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
              step="1"
              value={deathTime}
              onChange={(e) => setDeathTime(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="submit-btn">
              {isEditMode ? '更新' : '確認'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
