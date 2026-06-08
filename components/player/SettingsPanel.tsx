"use client"

import { useState } from "react"
import { X, ChevronRight, Check } from "lucide-react"

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
  onClose: () => void
}

type Panel = "main" | "quality" | "speed" | "deadBattery"

const QUALITIES = ["Auto", "2160p", "1440p", "1080p", "720p", "480p", "360p", "240p", "144p"]
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export default function SettingsPanel({ settings, onSettingsChange, onClose }: SettingsPanelProps) {
  const [panel, setPanel] = useState<Panel>("main")

  const set = (partial: Partial<PlayerSettings>) =>
    onSettingsChange({ ...settings, ...partial })

  const handlePanelClick = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      className="absolute bottom-[72px] right-3 z-50 w-72 rounded-xl overflow-hidden shadow-2xl border border-white/10"
      style={{ background: "#212121" }}
      onClick={handlePanelClick}
    >
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
              {panel === "quality" ? "Quality" : panel === "speed" ? "Playback speed" : "Dead battery time"}
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
        <div className="py-2">
          {[0, 10, 20, 30, 60, 90, 120, 180, 300].map((t) => (
            <button
              key={t}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
              onClick={() => { set({ deadBatteryTime: t }); setPanel("main") }}
            >
              <span className="text-white text-sm">{t === 0 ? "Disabled" : `After ${t} seconds`}</span>
              {settings.deadBatteryTime === t && <Check className="w-4 h-4 text-[#ff0000]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
