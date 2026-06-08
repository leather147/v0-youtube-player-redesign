"use client"

interface DeadBatteryScreenProps {
  onDismiss: () => void
}

export default function DeadBatteryScreen({ onDismiss }: DeadBatteryScreenProps) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ background: "#000000" }}
      onClick={onDismiss}
    >
      {/* Battery icon cluster */}
      <div className="flex flex-col items-center gap-6">
        {/* Dead battery circle with red border and lightning bolt */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulsing ring */}
          <div
            className="absolute rounded-full border-2"
            style={{
              width: 140,
              height: 140,
              borderColor: "rgba(255,0,0,0.2)",
              animation: "pulse-ring 2s ease-out infinite"
            }}
          />
          {/* Main circle */}
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 120,
              height: 120,
              border: "3px solid #ff0000",
              background: "rgba(255,0,0,0.04)",
              boxShadow: "0 0 30px rgba(255,0,0,0.25), inset 0 0 20px rgba(255,0,0,0.05)"
            }}
          >
            {/* Lightning bolt SVG */}
            <svg
              viewBox="0 0 40 60"
              width="36"
              height="54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 2L4 34h14L14 58L36 24H22L24 2Z"
                fill="#ff0000"
                stroke="#ff0000"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* USB Type-C cable silhouette */}
        <div className="flex flex-col items-center gap-0">
          {/* Cable plug head */}
          <svg
            viewBox="0 0 80 120"
            width="80"
            height="120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            opacity={0.7}
          >
            {/* USB-C connector body */}
            <rect x="24" y="2" width="32" height="20" rx="10" fill="#333" />
            {/* Inner connector contact */}
            <rect x="30" y="7" width="20" height="10" rx="5" fill="#1a1a1a" />
            {/* Cable thick part */}
            <rect x="34" y="22" width="12" height="16" rx="2" fill="#2a2a2a" />
            {/* Cable neck */}
            <rect x="36" y="38" width="8" height="12" rx="1" fill="#222" />
            {/* Cable body curving down */}
            <path
              d="M40 50 C40 60 50 70 50 80 C50 95 40 100 40 110"
              stroke="#1e1e1e"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Highlight on cable */}
            <path
              d="M40 50 C40 60 50 70 50 80 C50 95 40 100 40 110"
              stroke="#2e2e2e"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.8; }
          70% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(1.1); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
