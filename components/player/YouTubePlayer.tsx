"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import ProgressBar, { Chapter } from "./ProgressBar"
import SettingsPanel, { PlayerSettings } from "./SettingsPanel"
import DeadBatteryScreen from "./DeadBatteryScreen"

const SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

const SAMPLE_CHAPTERS: Chapter[] = [
  { time: 0, title: "Introduction" },
  { time: 30, title: "The Forest Awakens" },
  { time: 75, title: "Butterfly Chase" },
  { time: 120, title: "Bunny vs Birds" },
  { time: 180, title: "The Big Revenge" },
  { time: 240, title: "Finale" },
]

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  return `${m}:${String(sec).padStart(2, "0")}`
}

function VolumeIcon({ level }: { level: number }) {
  if (level === 0) return (
    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  )
  if (level < 0.4) return (
    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
    </svg>
  )
  return (
    <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}

export default function YouTubePlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const deadBatteryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showDeadBattery, setShowDeadBattery] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [showFullscreenBtn, setShowFullscreenBtn] = useState(false)
  const [seekFeedback, setSeekFeedback] = useState<{ dir: "left" | "right", sec: number } | null>(null)
  const [showPlayFeedback, setShowPlayFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [settings, setSettings] = useState<PlayerSettings>({
    quality: "Auto",
    playbackSpeed: 1,
    subtitles: false,
    autoplay: true,
    loopVideo: false,
    annotationsEnabled: true,
    deadBatteryTime: 30,
  })

  // Auto-hide overlay after 3s
  const scheduleHideOverlay = useCallback(() => {
    if (overlayHideTimer.current) clearTimeout(overlayHideTimer.current)
    overlayHideTimer.current = setTimeout(() => {
      if (!showSettings) setShowOverlay(false)
    }, 3000)
  }, [showSettings])

  // Dead battery timer
  useEffect(() => {
    if (deadBatteryTimer.current) clearTimeout(deadBatteryTimer.current)
    if (settings.deadBatteryTime > 0 && isPlaying) {
      deadBatteryTimer.current = setTimeout(() => {
        setShowDeadBattery(true)
        setIsPlaying(false)
        videoRef.current?.pause()
      }, settings.deadBatteryTime * 1000)
    }
    return () => {
      if (deadBatteryTimer.current) clearTimeout(deadBatteryTimer.current)
    }
  }, [settings.deadBatteryTime, isPlaying])

  // Playback speed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = settings.playbackSpeed
  }, [settings.playbackSpeed])

  // Loop
  useEffect(() => {
    if (videoRef.current) videoRef.current.loop = settings.loopVideo
  }, [settings.loopVideo])

  // Fullscreen change listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setIsPlaying(true)
    } else {
      v.pause()
      setIsPlaying(false)
    }
    setShowPlayFeedback(true)
    setTimeout(() => setShowPlayFeedback(false), 500)
  }, [])

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const isInteractive = target.closest("button, input, [data-interactive]")
    if (isInteractive) return

    if (!showOverlay) {
      setShowOverlay(true)
      scheduleHideOverlay()
    } else {
      if (overlayHideTimer.current) clearTimeout(overlayHideTimer.current)
      setShowOverlay(false)
    }
  }, [showOverlay, scheduleHideOverlay])

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const skipSeconds = useCallback((sec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + sec))
      setSeekFeedback({ dir: sec > 0 ? "right" : "left", sec: Math.abs(sec) })
      setTimeout(() => setSeekFeedback(null), 700)
    }
  }, [duration])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (videoRef.current) {
      videoRef.current.volume = v
      videoRef.current.muted = v === 0
    }
    setIsMuted(v === 0)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }, [])

  const toggleLandscape = useCallback(() => setIsLandscape(p => !p), [])

  const handleFullscreenMouseMove = useCallback(() => {
    setShowFullscreenBtn(true)
    if (overlayHideTimer.current) clearTimeout(overlayHideTimer.current)
    overlayHideTimer.current = setTimeout(() => setShowFullscreenBtn(false), 2500)
  }, [])

  const dismissDeadBattery = useCallback(() => {
    setShowDeadBattery(false)
    setShowOverlay(true)
    scheduleHideOverlay()
  }, [scheduleHideOverlay])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none"
      style={{
        background: "#000",
        width: "100%",
        aspectRatio: isLandscape ? "21/9" : "16/9",
        maxWidth: "100%",
        borderRadius: isFullscreen ? 0 : 8,
        transition: "aspect-ratio 0.3s ease",
        cursor: showOverlay ? "default" : "none",
      }}
      onClick={handleContainerClick}
      onMouseMove={handleFullscreenMouseMove}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={SAMPLE_VIDEO}
        className="absolute inset-0 w-full h-full object-contain"
        playsInline
        preload="metadata"
        onTimeUpdate={() => {
          const v = videoRef.current
          if (!v) return
          setCurrentTime(v.currentTime)
          if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1))
        }}
        onDurationChange={() => setDuration(videoRef.current?.duration ?? 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onLoadedData={() => setIsLoading(false)}
        onEnded={() => { setIsPlaying(false); setShowOverlay(true) }}
      />

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      )}

      {/* Seek feedback ripple */}
      {seekFeedback && (
        <div
          className={`absolute inset-y-0 flex items-center justify-center pointer-events-none ${seekFeedback.dir === "left" ? "left-0 right-1/2" : "left-1/2 right-0"}`}
          style={{ zIndex: 30 }}
        >
          <div
            className="flex flex-col items-center gap-1 animate-fade-out"
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="text-white text-xs font-medium">{seekFeedback.sec}s</span>
            <div className="flex gap-0.5">
              {[0, 1, 2].map(i => (
                <svg key={i} viewBox="0 0 8 12" width="8" height="12" fill="white" opacity={seekFeedback.dir === "right" ? 1 - i * 0.3 : (2 - i) * 0.4 + 0.15}>
                  <path d={seekFeedback.dir === "right" ? "M0 0l8 6-8 6V0z" : "M8 0L0 6l8 6V0z"} />
                </svg>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Play/Pause feedback center */}
      {showPlayFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 30 }}>
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              background: "rgba(0,0,0,0.5)",
              width: 72,
              height: 72,
              animation: "fadeInOut 0.5s ease-in-out forwards"
            }}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="white" width="36" height="36">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="white" width="36" height="36">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Dead battery screen */}
      {showDeadBattery && <DeadBatteryScreen onDismiss={dismissDeadBattery} />}

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-between"
        style={{
          opacity: showOverlay ? 1 : 0,
          transition: "opacity 0.25s ease",
          pointerEvents: showOverlay ? "none" : "none",
          zIndex: 20,
        }}
      >
        {/* Top gradient */}
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
        />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-3 pt-3 z-10" style={{ pointerEvents: showOverlay ? "auto" : "none" }}>
          <div className="flex items-center gap-2">
            {/* Back arrow */}
            <button className="p-2 rounded-full hover:bg-white/15 transition-colors" onClick={e => e.stopPropagation()}>
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="text-white text-sm font-medium leading-tight line-clamp-1">Big Buck Bunny</div>
              <div className="text-white/60 text-xs">Blender Foundation</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Cast */}
            <button className="p-2 rounded-full hover:bg-white/15 transition-colors" onClick={e => e.stopPropagation()}>
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11zm20-7H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
            {/* More (vertical dots) */}
            <button className="p-2 rounded-full hover:bg-white/15 transition-colors" onClick={e => e.stopPropagation()}>
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Center controls */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-10 z-10"
          style={{ pointerEvents: showOverlay ? "auto" : "none" }}
        >
          {/* Skip back 10s */}
          <button
            className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-white/15 transition-colors active:scale-90"
            onClick={e => { e.stopPropagation(); skipSeconds(-10) }}
            data-interactive="true"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              <text x="12" y="15" textAnchor="middle" fontSize="6" fill="white" fontFamily="sans-serif" fontWeight="bold">10</text>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            className="flex items-center justify-center rounded-full hover:bg-white/15 transition-colors active:scale-90"
            style={{ width: 64, height: 64 }}
            onClick={e => { e.stopPropagation(); togglePlay() }}
            data-interactive="true"
          >
            {isLoading ? (
              <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : isPlaying ? (
              <svg viewBox="0 0 24 24" fill="white" className="w-12 h-12">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="white" className="w-12 h-12">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Skip forward 10s */}
          <button
            className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-white/15 transition-colors active:scale-90"
            onClick={e => { e.stopPropagation(); skipSeconds(10) }}
            data-interactive="true"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9">
              <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
              <text x="12" y="15" textAnchor="middle" fontSize="6" fill="white" fontFamily="sans-serif" fontWeight="bold">10</text>
            </svg>
          </button>
        </div>

        {/* Bottom controls */}
        <div className="relative z-10" style={{ pointerEvents: showOverlay ? "auto" : "none" }}>
          {/* Progress bar */}
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            buffered={buffered}
            chapters={SAMPLE_CHAPTERS}
            onSeek={handleSeek}
          />

          {/* Bottom row */}
          <div className="flex items-center justify-between px-3 pb-3">
            {/* Left controls */}
            <div className="flex items-center gap-1">
              {/* Volume */}
              <button
                className="p-2 rounded-full hover:bg-white/15 transition-colors"
                onClick={e => { e.stopPropagation(); toggleMute() }}
                data-interactive="true"
              >
                <VolumeIcon level={isMuted ? 0 : volume} />
              </button>

              {/* Volume slider (shown inline on bigger screens) */}
              <div
                className="hidden sm:flex items-center"
                onClick={e => e.stopPropagation()}
                data-interactive="true"
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-white h-1 cursor-pointer"
                  style={{ accentColor: "#ff0000" }}
                />
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1">
              {/* Captions */}
              <button
                className={`p-2 rounded-full hover:bg-white/15 transition-colors ${settings.subtitles ? "text-[#ff0000]" : ""}`}
                onClick={e => { e.stopPropagation(); setSettings(s => ({ ...s, subtitles: !s.subtitles })) }}
                data-interactive="true"
              >
                <svg viewBox="0 0 24 24" fill={settings.subtitles ? "#ff0000" : "white"} className="w-5 h-5">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-10 7H8v1h2v1H7v-4h3v1H8v1zm4 2h-1v-4h3v1h-2v1h2v1h-2v1zm4-2h-1v1h1v1h-1c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h1v1z" />
                </svg>
              </button>

              {/* Settings */}
              <button
                className="p-2 rounded-full hover:bg-white/15 transition-colors"
                onClick={e => { e.stopPropagation(); setShowSettings(s => !s); setShowOverlay(true) }}
                data-interactive="true"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </button>

              {/* Landscape/rotate */}
              <button
                className="p-2 rounded-full hover:bg-white/15 transition-colors"
                onClick={e => { e.stopPropagation(); toggleLandscape() }}
                data-interactive="true"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z" />
                </svg>
              </button>

              {/* Fullscreen */}
              <button
                className={`p-2 rounded-full hover:bg-white/15 transition-colors ${isFullscreen ? "" : ""}`}
                style={{
                  opacity: isFullscreen ? (showFullscreenBtn ? 1 : 0) : 1,
                  transition: "opacity 0.3s ease",
                  pointerEvents: isFullscreen ? (showFullscreenBtn ? "auto" : "none") : "auto"
                }}
                onClick={e => { e.stopPropagation(); toggleFullscreen() }}
                data-interactive="true"
              >
                {isFullscreen ? (
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen enter button (always visible, fades in/out on mouse move) */}
      {!showOverlay && (
        <button
          className="absolute bottom-4 right-4 p-2 rounded-full"
          style={{
            background: "rgba(0,0,0,0.5)",
            opacity: showFullscreenBtn ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: showFullscreenBtn ? "auto" : "none",
            zIndex: 25
          }}
          onClick={e => { e.stopPropagation(); toggleFullscreen() }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        </button>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.7); }
          30% { opacity: 1; transform: scale(1); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.1); }
        }
        @keyframes yt-fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fade-out {
          animation: yt-fade-out 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
