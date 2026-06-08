"use client"

import { useRef, useState } from "react"
import { X, ChevronRight } from "lucide-react"

export interface PlayerSettings {
  quality: string
  playbackSpeed: number
  subtitles: boolean
  autoplay: boolean
  loopVideo: boolean
  annotationsEnabled: boolean
  deadBatteryTime: number // seconds
}

interface SettingsPanelProps {
  settings: PlayerSettings
  onSettingsChange: (s: PlayerSettings) => void
  onVideoSource: (src: string) => void
  onClose: () => void
}

type Panel = "main" | "quality" | "speed" | "deadBattery" | "openUrl"

const QUALITIES = ["Auto", "2160p", "1440p", "1080p", "720p", "480p", "360p", "240p", "144p"]
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export default function SettingsPanel({ settings, onSettingsChange, onVideoSource, onClose }: SettingsPanelProps) {
  const [panel, setPanel] = useState<Panel>("main")
  const [urlInput, setUrlInput] = useState("")
  const [urlError, setUrlError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dead battery time input state — initialised from current settings
  const initMins = Math.floor(settings.deadBatteryTime / 60)
  const initSecs = settings.deadBatteryTime % 60
  const [dbMinutes, setDbMinutes] = useState(String(initMins))
  const [dbSeconds, setDbSeconds] = useState(String(initSecs))
  const [dbError, setDbError] = useState("")

  const handleDbApply = () => {
    const mins = parseInt(dbMinutes || "0", 10)
    const secs = parseInt(dbSeconds || "0", 10)
    if (isNaN(mins) || isNaN(secs) || mins < 0 || secs < 0 || secs > 59) {
      setDbError("Enter valid time (seconds 0–59)")
      return
    }
    const total = mins * 60 + secs
    setDbError("")
    set({ deadBatteryTime: total })
    setPanel("main")
  }

  const handleDbDisable = () => {
    setDbMinutes("0")
    setDbSeconds("0")
    setDbError("")
    set({ deadBatteryTime: 0 })
    setPanel("main")
  }

  const handleFileOpen = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    onVideoSource(objectUrl)
    onClose()
    // Reset so same file can be picked again
    e.target.value = ""
  }

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim()
    if (!trimmed) {
      setUrlError("Please enter a URL")
      return
    }
    try {
      new URL(trimmed)
    } catch {
      setUrlError("Invalid URL format")
      return
    }
    onVideoSource(trimmed)
    setUrlInput("")
    setUrlError("")
    onClose()
  }

  const set = (partial: Partial<PlayerSettings>) =>
    onSettingsChange({ ...settings, ...partial })

  const handlePanelClick = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      className="absolute bottom-[72px] right-3 z-50 w-72 rounded-xl overflow-hidden shadow-2xl border border-white/10"
      style={{ background: "#212121" }}
      onClick={handlePanelClick}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        {panel !== "main" ? (
          <button
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setPanel("main")}
          >
            <svg className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span className="text-sm font-medium">
              {panel === "quality" ? "Quality"
                : panel === "speed" ? "Playback speed"
                : panel === "deadBattery" ? "Dead battery time"
                : panel === "openUrl" ? "Open by URL"
                : ""}
            </span>
          </button>
        ) : (
          <span className="text-white text-sm font-semibold">Settings</span>
        )}
        <button
          className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main panel */}
      {panel === "main" && (
        <div className="py-2">
          {/* Quality */}
          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setPanel("quality")}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              <div className="text-left">
                <div className="text-white text-sm">Quality</div>
                <div className="text-white/50 text-xs">{settings.quality}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          {/* Speed */}
          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setPanel("speed")}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div className="text-left">
                <div className="text-white text-sm">Playback speed</div>
                <div className="text-white/50 text-xs">{settings.playbackSpeed === 1 ? "Normal" : `${settings.playbackSpeed}x`}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          {/* Subtitles */}
          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => set({ subtitles: !settings.subtitles })}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M7 15h4M7 11h10" />
              </svg>
              <span className="text-white text-sm">Subtitles / CC</span>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors ${settings.subtitles ? "bg-[#ff0000]" : "bg-white/20"} relative`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.subtitles ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </button>

          {/* Autoplay */}
          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => set({ autoplay: !settings.autoplay })}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
              <span className="text-white text-sm">Autoplay</span>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors ${settings.autoplay ? "bg-[#ff0000]" : "bg-white/20"} relative`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.autoplay ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </button>

          {/* Loop */}
          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => set({ loopVideo: !settings.loopVideo })}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M17 2l4 4-4 4" />
                <path d="M3 11V9a4 4 0 014-4h14" />
                <path d="M7 22l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              <span className="text-white text-sm">Loop video</span>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors ${settings.loopVideo ? "bg-[#ff0000]" : "bg-white/20"} relative`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.loopVideo ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </button>

          {/* Dead Battery Time */}
          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setPanel("deadBattery")}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="7" width="18" height="10" rx="2" />
                <path d="M20 11h2v2h-2z" />
                <path d="M11 10l-2 4h4l-2 4" />
              </svg>
              <div className="text-left">
                <div className="text-white text-sm">Dead battery interrupt</div>
                <div className="text-white/50 text-xs">
                  {settings.deadBatteryTime === 0 ? "Disabled" : `After ${settings.deadBatteryTime}s`}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          {/* Divider */}
          <div className="border-t border-white/10 my-2" />

          {/* Open from device */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={handleFileOpen}
          >
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              <path d="M12 11v6M9 14l3-3 3 3" />
            </svg>
            <span className="text-white text-sm">Open from device</span>
          </button>

          {/* Open by URL */}
          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setPanel("openUrl")}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
              </svg>
              <span className="text-white text-sm">Open by URL</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          {/* Second divider */}
          <div className="border-t border-white/10 my-2" />

          {/* Report */}
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span className="text-white text-sm">Report</span>
          </button>

          {/* Share */}
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16,6 12,2 8,6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span className="text-white text-sm">Share</span>
          </button>

          {/* Help */}
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span className="text-white text-sm">Help & feedback</span>
          </button>
        </div>
      )}

      {/* Quality panel */}
      {panel === "quality" && (
        <div className="py-2">
          {QUALITIES.map((q) => (
            <button
              key={q}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
              onClick={() => { set({ quality: q }); setPanel("main") }}
            >
              <span className="text-white text-sm">{q}</span>
              {settings.quality === q && <Check className="w-4 h-4 text-[#ff0000]" />}
            </button>
          ))}
        </div>
      )}

      {/* Speed panel */}
      {panel === "speed" && (
        <div className="py-2">
          {SPEEDS.map((spd) => (
            <button
              key={spd}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
              onClick={() => { set({ playbackSpeed: spd }); setPanel("main") }}
            >
              <span className="text-white text-sm">{spd === 1 ? "Normal" : `${spd}x`}</span>
              {settings.playbackSpeed === spd && <Check className="w-4 h-4 text-[#ff0000]" />}
            </button>
          ))}
        </div>
      )}

      {/* Dead battery time panel */}
      {panel === "deadBattery" && (
        <div className="p-4 flex flex-col gap-4">
          <p className="text-white/60 text-xs leading-relaxed">
            Set the exact time after which the dead battery screen appears. Set both to 0 to disable.
          </p>

          {/* Current value badge */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">Current:</span>
            <span className="text-white/80 text-xs font-mono">
              {settings.deadBatteryTime === 0
                ? "Disabled"
                : `${Math.floor(settings.deadBatteryTime / 60)}m ${settings.deadBatteryTime % 60}s`}
            </span>
          </div>

          {/* Minutes + Seconds inputs */}
          <div className="flex items-end gap-3">
            {/* Minutes */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-white/50 text-xs">Minutes</label>
              <input
                type="number"
                min={0}
                value={dbMinutes}
                onChange={e => { setDbMinutes(e.target.value); setDbError("") }}
                onKeyDown={e => { if (e.key === "Enter") handleDbApply() }}
                className="w-full rounded-lg px-3 py-2 text-sm text-white text-center font-mono outline-none focus:ring-1 focus:ring-[#ff0000] border border-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ background: "#2d2d2d" }}
                placeholder="0"
              />
            </div>

            <span className="text-white/40 text-lg font-bold pb-2">:</span>

            {/* Seconds */}
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-white/50 text-xs">Seconds</label>
              <input
                type="number"
                min={0}
                max={59}
                value={dbSeconds}
                onChange={e => { setDbSeconds(e.target.value); setDbError("") }}
                onKeyDown={e => { if (e.key === "Enter") handleDbApply() }}
                className="w-full rounded-lg px-3 py-2 text-sm text-white text-center font-mono outline-none focus:ring-1 focus:ring-[#ff0000] border border-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ background: "#2d2d2d" }}
                placeholder="0"
              />
            </div>
          </div>

          {dbError && <span className="text-[#ff4444] text-xs">{dbError}</span>}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-lg py-2 text-sm font-semibold text-white/60 border border-white/10 hover:bg-white/10 transition-colors"
              onClick={handleDbDisable}
            >
              Disable
            </button>
            <button
              className="flex-1 rounded-lg py-2 text-sm font-semibold text-white transition-colors"
              style={{ background: "#ff0000" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#cc0000")}
              onMouseLeave={e => (e.currentTarget.style.background = "#ff0000")}
              onClick={handleDbApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Open by URL panel */}
      {panel === "openUrl" && (
        <div className="p-4 flex flex-col gap-3">
          <p className="text-white/60 text-xs leading-relaxed">
            Paste a direct link to a video file (mp4, webm, ogg, etc.)
          </p>
          <div className="flex flex-col gap-1">
            <input
              type="url"
              value={urlInput}
              onChange={e => { setUrlInput(e.target.value); setUrlError("") }}
              onKeyDown={e => { if (e.key === "Enter") handleUrlSubmit() }}
              placeholder="https://example.com/video.mp4"
              className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#ff0000] border border-white/10"
              style={{ background: "#2d2d2d" }}
              autoFocus
            />
            {urlError && (
              <span className="text-[#ff4444] text-xs">{urlError}</span>
            )}
          </div>
          <button
            className="w-full rounded-lg py-2 text-sm font-semibold text-white transition-colors"
            style={{ background: "#ff0000" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#cc0000")}
            onMouseLeave={e => (e.currentTarget.style.background = "#ff0000")}
            onClick={handleUrlSubmit}
          >
            Open video
          </button>
        </div>
      )}
    </div>
  )
}
