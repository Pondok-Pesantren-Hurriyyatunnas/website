'use client'

import { useSyncExternalStore } from 'react'

const pad = (value: number) => String(value).padStart(2, '0')

// Jam bersama yang berdetak tiap detik; dibaca lewat useSyncExternalStore
let currentTime = Date.now()
const subscribe = (onTick: () => void) => {
  const timer = setInterval(() => {
    currentTime = Date.now()
    onTick()
  }, 1000)
  return () => clearInterval(timer)
}
const getSnapshot = () => currentTime
// Di server belum ada jam berjalan: tampilkan placeholder supaya HTML server & browser sama
const getServerSnapshot = () => null

type Props = {
  target: string
  className?: string
  daysClassName?: string
  doneClassName?: string
  doneText?: string
}

// Hitung mundur ke suatu waktu (dipakai di dashboard & website untuk penutupan PSB)
export function Countdown({ target, className, daysClassName, doneClassName, doneText = 'Pendaftaran telah ditutup' }: Props) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (now === null) return <div className={className}>--:--:--</div>

  const remaining = new Date(target).getTime() - now
  if (remaining <= 0) return <div className={doneClassName ?? className}>{doneText}</div>

  const totalSeconds = Math.floor(remaining / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
    <div className={className}>
      {days > 0 && (
        <span className={daysClassName}>
          {days}
          <small> hari</small>
        </span>
      )}
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </div>
  )
}
