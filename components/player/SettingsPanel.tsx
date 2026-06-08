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
  deadBatteryTime: number
}

export type Locale = "ru" | "en"

const T: Record<Locale, Record<string, string>> = {
  ru: {
    settings: "Настройки",
    quality: "Качество",
    speed: "Скорость воспроизведения",
    normal: "Обычная",
    subtitles: "Субтитры / CC",
    autoplay: "Автовоспроизведение",
    loop: "Повтор видео",
    deadBattery: "Экран разряда батареи",
    disabled: "Отключено",
    openFromDevice: "Открыть с устройства",
    openByUrl: "Открыть по ссылке",
    report: "Пожаловаться",
    share: "Поделиться",
    help: "Помощь и обратная связь",
    language: "Язык интерфейса",
    setTimeHint: "Укажите точное время появления экрана разряда. Оба значения 0 — отключить.",
    current: "Текущее",
    minutesLabel: "Минуты",
    secondsLabel: "Секунды",
    disable: "Отключить",
    apply: "Применить",
    invalidTime: "Введите корректное время (секунды 0–59)",
    pasteUrlHint: "Вставьте прямую ссылку на видеофайл (mp4, webm, ogg и др.)",
    urlPlaceholder: "https://example.com/video.mp4",
    openVideo: "Открыть видео",
    enterUrl: "Введите URL",
    invalidUrl: "Неверный формат URL",
  },
  en: {
    settings: "Settings",
    quality: "Quality",
    speed: "Playback speed",
    normal: "Normal",
    subtitles: "Subtitles / CC",
    autoplay: "Autoplay",
    loop: "Loop video",
    deadBattery: "Dead battery interrupt",
    disabled: "Disabled",
    openFromDevice: "Open from device",
    openByUrl: "Open by URL",
    report: "Report",
    share: "Share",
    help: "Help & feedback",
    language: "Interface language",
    setTimeHint: "Set the exact time after which the dead battery screen appears. Both 0 — disable.",
    current: "Current",
    minutesLabel: "Minutes",
    secondsLabel: "Seconds",
    disable: "Disable",
    apply: "Apply",
    invalidTime: "Enter valid time (seconds 0–59)",
    pasteUrlHint: "Paste a direct link to a video file (mp4, webm, ogg, etc.)",
    urlPlaceholder: "https://example.com/video.mp4",
    openVideo: "Open video",
    enterUrl: "Enter URL",
    invalidUrl: "Invalid URL format",
  },
}

const QUALITIES = ["Auto", "2160p", "1440p", "1080p", "720p", "480p", "360p", "240p", "144p"]
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

interface SettingsPanelProps {
  settings: PlayerSettings
  onSettingsChange: (s: PlayerSettings) => void
  onVideoSource: (src: string) => void
  onClose: () => void
  locale: Locale
  onLocaleChange: (l: Locale) => void
}

type Panel = "main" | "quality" | "speed" | "deadBattery" | "openUrl" | "language"

function Toggle({ on }: { on: boolean }) {
  return (
    <div className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 relative ${on ? "bg-[#ff0000]" : "bg-white/20"}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </div>
  )
}

function ActiveDot() {
  return <div className="w-2 h-2 rounded-full bg-[#ff0000] flex-shrink-0" />
}

export default function SettingsPanel({
  settings, onSettingsChange, onVideoSource, onClose, locale, onLocaleChange,
}: SettingsPanelProps) {
  const t = T[locale]
  const [panel, setPanel] = useState<Panel>("main")
  const [urlInput, setUrlInput] = useState("")
  const [urlError, setUrlError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initMins = Math.floor(settings.deadBatteryTime / 60)
  const initSecs = settings.deadBatteryTime % 60
  const [dbMinutes, setDbMinutes] = useState(String(initMins))
  const [dbSeconds, setDbSeconds] = useState(String(initSecs))
  const [dbError, setDbError] = useState("")

  const set = (partial: Partial<PlayerSettings>) =>
    onSettingsChange({ ...settings, ...partial })

  const handleDbApply = () => {
    const mins = parseInt(dbMinutes || "0", 10)
    const secs = parseInt(dbSeconds || "0", 10)
    if (isNaN(mins) || isNaN(secs) || mins < 0 || secs < 0 || secs > 59) {
      setDbError(t.invalidTime)
      return
    }
    set({ deadBatteryTime: mins * 60 + secs })
    setDbError("")
    setPanel("main")
  }

  const handleDbDisable = () => {
    setDbMinutes("0")
    setDbSeconds("0")
    setDbError("")
    set({ deadBatteryTime: 0 })
    setPanel("main")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onVideoSource(URL.createObjectURL(file))
    onClose()
    e.target.value = ""
  }

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim()
    if (!trimmed) { setUrlError(t.enterUrl); return }
    try { new URL(trimmed) } catch { setUrlError(t.invalidUrl); return }
    onVideoSource(trimmed)
    setUrlInput("")
    setUrlError("")
    onClose()
  }

  const handlePanelClick = (e: React.MouseEvent) => e.stopPropagation()

  const panelTitle = () => {
    if (panel === "quality") return t.quality
    if (panel === "speed") return t.speed
    if (panel === "deadBattery") return t.deadBattery
    if (panel === "openUrl") return t.openByUrl
    if (panel === "language") return t.language
    return ""
  }

  const deadBatteryLabel = settings.deadBatteryTime === 0
    ? t.disabled
    : locale === "ru"
      ? `${Math.floor(settings.deadBatteryTime / 60)}м ${settings.deadBatteryTime % 60}с`
      : `${Math.floor(settings.deadBatteryTime / 60)}m ${settings.deadBatteryTime % 60}s`

  return (
    <div
      className="absolute bottom-[72px] right-3 z-50 w-72 rounded-xl overflow-hidden shadow-2xl border border-white/10"
      style={{ background: "#212121" }}
      onClick={handlePanelClick}
    >
      <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />

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
            <span className="text-sm font-medium">{panelTitle()}</span>
          </button>
        ) : (
          <span className="text-white text-sm font-semibold">{t.settings}</span>
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
          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setPanel("quality")}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
              </svg>
              <div className="text-left">
                <div className="text-white text-sm">{t.quality}</div>
                <div className="text-white/50 text-xs">{settings.quality}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setPanel("speed")}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              <div className="text-left">
                <div className="text-white text-sm">{t.speed}</div>
                <div className="text-white/50 text-xs">{settings.playbackSpeed === 1 ? t.normal : `${settings.playbackSpeed}x`}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => set({ subtitles: !settings.subtitles })}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M7 15h4M7 11h10" />
              </svg>
              <span className="text-white text-sm">{t.subtitles}</span>
            </div>
            <Toggle on={settings.subtitles} />
          </button>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => set({ autoplay: !settings.autoplay })}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
              <span className="text-white text-sm">{t.autoplay}</span>
            </div>
            <Toggle on={settings.autoplay} />
          </button>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => set({ loopVideo: !settings.loopVideo })}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" />
                <path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              <span className="text-white text-sm">{t.loop}</span>
            </div>
            <Toggle on={settings.loopVideo} />
          </button>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setPanel("deadBattery")}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="7" width="18" height="10" rx="2" /><path d="M20 11h2v2h-2z" />
                <path d="M11 10l-2 4h4l-2 4" />
              </svg>
              <div className="text-left">
                <div className="text-white text-sm">{t.deadBattery}</div>
                <div className="text-white/50 text-xs">{deadBatteryLabel}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          <div className="border-t border-white/10 my-2" />

          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              <path d="M12 11v6M9 14l3-3 3 3" />
            </svg>
            <span className="text-white text-sm">{t.openFromDevice}</span>
          </button>

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setPanel("openUrl")}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
              </svg>
              <span className="text-white text-sm">{t.openByUrl}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          <div className="border-t border-white/10 my-2" />

          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
            onClick={() => setPanel("language")}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                <path d="M2 12h20M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10" />
              </svg>
              <div className="text-left">
                <div className="text-white text-sm">{t.language}</div>
                <div className="text-white/50 text-xs">{locale === "ru" ? "Русский" : "English"}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40" />
          </button>

          <div className="border-t border-white/10 my-2" />

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <span className="text-white text-sm">{t.report}</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16,6 12,2 8,6" /><line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span className="text-white text-sm">{t.share}</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
            </svg>
            <span className="text-white text-sm">{t.help}</span>
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
              {settings.quality === q && <ActiveDot />}
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
              <span className="text-white text-sm">{spd === 1 ? t.normal : `${spd}x`}</span>
              {settings.playbackSpeed === spd && <ActiveDot />}
            </button>
          ))}
        </div>
      )}

      {/* Language panel */}
      {panel === "language" && (
        <div className="py-2">
          {(["ru", "en"] as Locale[]).map((l) => (
            <button
              key={l}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors"
              onClick={() => { onLocaleChange(l); setPanel("main") }}
            >
              <span className="text-white text-sm">{l === "ru" ? "Русский" : "English"}</span>
              {locale === l && <ActiveDot />}
            </button>
          ))}
        </div>
      )}

      {/* Dead battery time panel */}
      {panel === "deadBattery" && (
        <div className="p-4 flex flex-col gap-4">
          <p className="text-white/60 text-xs leading-relaxed">{t.setTimeHint}</p>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs">{t.current}:</span>
            <span className="text-white/80 text-xs font-mono">{deadBatteryLabel}</span>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-white/50 text-xs">{t.minutesLabel}</label>
              <input
                type="number" min={0} value={dbMinutes}
                onChange={e => { setDbMinutes(e.target.value); setDbError("") }}
                onKeyDown={e => { if (e.key === "Enter") handleDbApply() }}
                className="w-full rounded-lg px-3 py-2 text-sm text-white text-center font-mono outline-none focus:ring-1 focus:ring-[#ff0000] border border-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ background: "#2d2d2d" }} placeholder="0"
              />
            </div>
            <span className="text-white/40 text-lg font-bold pb-2">:</span>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-white/50 text-xs">{t.secondsLabel}</label>
              <input
                type="number" min={0} max={59} value={dbSeconds}
                onChange={e => { setDbSeconds(e.target.value); setDbError("") }}
                onKeyDown={e => { if (e.key === "Enter") handleDbApply() }}
                className="w-full rounded-lg px-3 py-2 text-sm text-white text-center font-mono outline-none focus:ring-1 focus:ring-[#ff0000] border border-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{ background: "#2d2d2d" }} placeholder="0"
              />
            </div>
          </div>
          {dbError && <span className="text-[#ff4444] text-xs">{dbError}</span>}
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-lg py-2 text-sm font-semibold text-white/60 border border-white/10 hover:bg-white/10 transition-colors"
              onClick={handleDbDisable}
            >{t.disable}</button>
            <button
              className="flex-1 rounded-lg py-2 text-sm font-semibold text-white transition-colors"
              style={{ background: "#ff0000" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#cc0000")}
              onMouseLeave={e => (e.currentTarget.style.background = "#ff0000")}
              onClick={handleDbApply}
            >{t.apply}</button>
          </div>
        </div>
      )}

      {/* Open by URL panel */}
      {panel === "openUrl" && (
        <div className="p-4 flex flex-col gap-3">
          <p className="text-white/60 text-xs leading-relaxed">{t.pasteUrlHint}</p>
          <div className="flex flex-col gap-1">
            <input
              type="url" value={urlInput}
              onChange={e => { setUrlInput(e.target.value); setUrlError("") }}
              onKeyDown={e => { if (e.key === "Enter") handleUrlSubmit() }}
              placeholder={t.urlPlaceholder}
              className="w-full rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#ff0000] border border-white/10"
              style={{ background: "#2d2d2d" }} autoFocus
            />
            {urlError && <span className="text-[#ff4444] text-xs">{urlError}</span>}
          </div>
          <button
            className="w-full rounded-lg py-2 text-sm font-semibold text-white transition-colors"
            style={{ background: "#ff0000" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#cc0000")}
            onMouseLeave={e => (e.currentTarget.style.background = "#ff0000")}
            onClick={handleUrlSubmit}
          >{t.openVideo}</button>
        </div>
      )}
    </div>
  )
}
