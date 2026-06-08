"use client"

import { useRef, useState, useCallback } from "react"

export interface Chapter {
  time: number
  title: string
}

interface ProgressBarProps {
  currentTime: number
  duration: number
  buffered: number
  chapters: Chapter[]
  onSeek: (time: number) => void
}

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  return `${m}:${String(sec).padStart(2, "0")}`
}

export default function ProgressBar({ currentTime, duration, buffered, chapters, onSeek }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const [hoverTime, setHoverTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const getTimeFromX = useCallback((clientX: number) => {
    if (!barRef.current) return 0
    const rect = barRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return ratio * duration
  }, [duration])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    setHoverX(x)
    setHoverTime(getTimeFromX(e.clientX))
    if (isDragging) {
      onSeek(getTimeFromX(e.clientX))
    }
  }, [isDragging, getTimeFromX, onSeek])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDragging(true)
    onSeek(getTimeFromX(e.clientX))
  }, [getTimeFromX, onSeek])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    onSeek(getTimeFromX(e.touches[0].clientX))
  }, [getTimeFromX, onSeek])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    onSeek(getTimeFromX(e.touches[0].clientX))
  }, [getTimeFromX, onSeek])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0

  const hoverChapter = chapters.find((c, i) => {
    const next = chapters[i + 1]
    return hoverTime >= c.time && (!next || hoverTime < next.time)
  })

  const currentChapter = chapters.find((c, i) => {
    const next = chapters[i + 1]
    return currentTime >= c.time && (!next || currentTime < next.time)
  })

  return (
    <div className="w-full px-3 pb-1">
      {/* Chapter name */}
      {currentChapter && (
        <div className="text-xs text-white/60 mb-1 px-1">{currentChapter.title}</div>
      )}

      {/* Hover tooltip */}
      {isHovering && hoverX !== null && (
        <div
          className="absolute bottom-[68px] z-50 flex flex-col items-center pointer-events-none"
          style={{ left: `calc(${hoverX}px + 12px)`, transform: "translateX(-50%)" }}
        >
          {hoverChapter && (
            <div className="bg-[#212121] text-white text-xs px-2 py-1 rounded mb-1 whitespace-nowrap shadow-lg border border-white/10">
              {hoverChapter.title}
            </div>
          )}
          <div className="bg-[#212121] text-white text-xs px-2 py-1 rounded shadow-lg">
            {formatTime(hoverTime)}
          </div>
        </div>
      )}

      {/* Bar track */}
      <div
        ref={barRef}
        className="relative w-full cursor-pointer select-none"
        style={{ height: isHovering || isDragging ? 20 : 14, transition: "height 0.1s" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { setIsHovering(false); setHoverX(null); setIsDragging(false) }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Background */}
        <div className="absolute inset-0 flex items-center">
          <div className="relative w-full" style={{ height: isHovering || isDragging ? 4 : 3, transition: "height 0.1s" }}>
            <div className="absolute inset-0 rounded-full bg-white/20" />
            {/* Buffered */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/35"
              style={{ width: `${bufferedPct}%` }}
            />
            {/* Chapter segments */}
            {chapters.length > 1 && chapters.map((ch, i) => {
              const next = chapters[i + 1]
              if (!next) return null
              const left = (ch.time / duration) * 100
              const right = (next.time / duration) * 100
              const isFilled = currentTime >= next.time
              const isActive = currentTime >= ch.time && currentTime < next.time
              return (
                <div
                  key={ch.time}
                  className="absolute inset-y-0"
                  style={{ left: `${left}%`, width: `${right - left}%` }}
                >
                  <div className="absolute inset-0 mx-[1px] rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: isActive
                          ? `${((currentTime - ch.time) / (next.time - ch.time)) * 100}%`
                          : isFilled ? "100%" : "0%",
                        backgroundColor: "var(--yt-red)",
                        transition: "width 0.1s linear"
                      }}
                    />
                  </div>
                </div>
              )
            })}
            {/* Solid progress (no chapters) */}
            {chapters.length <= 1 && (
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${progress}%`, backgroundColor: "var(--yt-red)", transition: "width 0.1s linear" }}
              />
            )}
            {/* Thumb — red dot, always vertically centred on the track */}
            <div
              className="absolute rounded-full"
              style={{
                left: `${progress}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: isHovering || isDragging ? 14 : 10,
                height: isHovering || isDragging ? 14 : 10,
                background: "var(--yt-red)",
                transition: "width 0.1s, height 0.1s",
                boxShadow: "0 0 6px rgba(255,0,0,0.5)"
              }}
            />
          </div>
        </div>

        {/* Chapter markers */}
        {chapters.length > 1 && chapters.slice(1).map((ch) => (
          <div
            key={ch.time}
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2 bg-black/60 z-10 pointer-events-none"
            style={{ left: `${(ch.time / duration) * 100}%` }}
          />
        ))}
      </div>

      {/* Time display */}
      <div className="flex items-center justify-between mt-1 px-1">
        <span className="text-white text-xs font-medium tabular-nums">{formatTime(currentTime)}</span>
        <span className="text-white/60 text-xs tabular-nums">{formatTime(duration)}</span>
      </div>
    </div>
  )
}
