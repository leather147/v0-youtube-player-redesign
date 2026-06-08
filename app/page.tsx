import YouTubePlayer from "@/components/player/YouTubePlayer"

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#0f0f0f" }}>
      {/* YouTube-style top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 z-30" style={{ background: "#0f0f0f" }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 120 26" width="90" height="20" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="2" width="34" height="22" rx="6" fill="#ff0000" />
              <polygon points="13,8 13,18 22,13" fill="white" />
              <text x="40" y="19" fontSize="17" fontWeight="700" fill="white" fontFamily="'Roboto','Arial',sans-serif" letterSpacing="-0.3">YouTube</text>
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff0000] rounded-full border border-[#0f0f0f]" />
          </button>
          <button className="w-8 h-8 rounded-full bg-[#3ea6ff] flex items-center justify-center text-white text-sm font-bold ml-1">
            U
          </button>
        </div>
      </header>

      {/* Player area */}
      <div className="w-full" style={{ background: "#000" }}>
        <YouTubePlayer />
      </div>

      {/* Video info */}
      <div className="px-4 py-4 space-y-3" style={{ background: "#0f0f0f" }}>
        <h1 className="text-white text-base font-semibold leading-snug text-balance">
          Big Buck Bunny — Official Short Film (2008) Full HD 4K
        </h1>

        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm">142M views · 3 years ago</span>
          <button className="flex items-center gap-1 text-white/60 text-xs hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
            </svg>
            more
          </button>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {[
            {
              icon: <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" /></svg>,
              label: "4.2M"
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" /></svg>,
              label: "Dislike"
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" /></svg>,
              label: "Share"
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>,
              label: "Download"
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>,
              label: "Save"
            },
            {
              icon: <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M11 17H9V8l-3.5 3.5-1.42-1.42L9 5.17l.59-.59c.2-.19.45-.28.71-.28s.51.09.71.29L11 5.17V17zm5.5-8.5L13 5v12h-2V8l-3.5 3.5L6.08 10.08 11.29 4.88c.39-.39 1.02-.39 1.41 0L18 10.5l-1.5 1.5z" /></svg>,
              label: "Remix"
            },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-colors hover:bg-white/20 active:bg-white/25 flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.1)", whiteSpace: "nowrap" }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Channel row */}
        <div className="flex items-center justify-between py-3 border-t border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #ff6b35, #f7c59f)" }}>
              BF
            </div>
            <div>
              <div className="text-white text-sm font-medium flex items-center gap-1">
                Blender Foundation
                <svg viewBox="0 0 24 24" fill="#aaa" className="w-3.5 h-3.5 flex-shrink-0">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <div className="text-white/50 text-xs">12.4M subscribers</div>
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-full text-sm font-semibold text-white flex-shrink-0"
            style={{ background: "#ff0000" }}
          >
            Subscribe
          </button>
        </div>

        {/* Description snippet */}
        <div className="rounded-xl p-3 text-sm text-white/70 leading-relaxed" style={{ background: "rgba(255,255,255,0.05)" }}>
          <p className="line-clamp-2">
            Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, he decides to tell the world a little something about himself...
          </p>
          <button className="text-white text-xs font-medium mt-1 hover:text-white/80">Show more</button>
        </div>

        {/* Comments header */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-white text-sm font-semibold">Comments <span className="text-white/50">87K</span></span>
          <button className="flex items-center gap-1 text-white/60 text-xs hover:text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
            </svg>
            Top
          </button>
        </div>

        {/* Sample comment */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ background: "#4285f4" }}>
            A
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white text-xs font-medium">@viewer_alex</span>
              <span className="text-white/40 text-xs">2 days ago</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">Absolute classic. Still holds up after all these years. The animation quality is incredible for 2008!</p>
            <div className="flex items-center gap-3 mt-2">
              <button className="flex items-center gap-1 text-white/50 text-xs hover:text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                3.4K
              </button>
              <button className="text-white/50 text-xs hover:text-white">Reply</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
