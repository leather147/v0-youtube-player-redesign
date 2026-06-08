"use client"

interface DeadBatteryScreenProps {
  onDismiss: () => void
}

export default function DeadBatteryScreen({ onDismiss }: DeadBatteryScreenProps) {
  return (
    /*
      Full-screen overlay covering the entire viewport (fixed),
      but the inner content block is rotated 90deg so it reads
      in portrait orientation — like a phone screen.
    */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer select-none"
      style={{ background: "#000000" }}
      onClick={onDismiss}
    >
      {/* Rotated content — portrait layout inside a landscape player */}
      <div
        className="flex flex-col items-center"
        style={{ transform: "rotate(90deg)", transformOrigin: "center center" }}
      >
        {/* Dead battery circle with red border and lightning bolt */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulsing ring */}
          <div
            className="absolute rounded-full border-2"
            style={{
              width: 210,
              height: 210,
              borderColor: "rgba(255,0,0,0.2)",
              animation: "pulse-ring 2s ease-out infinite"
            }}
          />
          {/* Main circle */}
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 210,
              height: 210,
              border: "3px solid #ff0000",
              background: "rgba(255,0,0,0.04)",
              boxShadow: "0 0 30px rgba(255,0,0,0.25), inset 0 0 20px rgba(255,0,0,0.05)"
            }}
          >
            {/* Lightning bolt */}
            <svg viewBox="0 0 40 60" width="54" height="81" fill="none" xmlns="http://www.w3.org/2000/svg">
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

        {/* USB Type-C cable silhouette — white, pushed lower */}
        <div style={{ marginTop: 48 }}>
          <svg
            viewBox="0 0 80 130"
            width="108"
            height="176"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* USB-C connector pill */}
            <rect x="24" y="2" width="32" height="20" rx="10" fill="white" />
            {/* Inner oval cutout (dark) */}
            <rect x="30" y="7" width="20" height="10" rx="5" fill="#000" />
            {/* Connector neck */}
            <rect x="33" y="22" width="14" height="14" rx="3" fill="white" />
            {/* Cable body — straight then curves */}
            <path
              d="M40 36 L40 56 C40 70 52 78 52 92 C52 110 40 118 40 128"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Subtle centre highlight */}
            <path
              d="M40 36 L40 56 C40 70 52 78 52 92 C52 110 40 118 40 128"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.8; }
          70%  { transform: scale(1.1);  opacity: 0;   }
          100% { transform: scale(1.1);  opacity: 0;   }
        }
      `}</style>
    </div>
  )
}
