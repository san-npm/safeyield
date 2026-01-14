import React from 'react';

interface YiieldLogoProps {
  className?: string;
  size?: number;
}

export const YiieldLogo: React.FC<YiieldLogoProps> = ({ className = '', size = 120 }) => {
  const fontSize = size / 3;
  const barWidth = size / 20;
  const barHeight = size / 4;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <svg
        width={size}
        height={size / 2}
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Y */}
        <text
          x="0"
          y="30"
          fontSize="32"
          fontWeight="700"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          y
        </text>

        {/* First i with red bar (down) */}
        <g>
          <text
            x="18"
            y="30"
            fontSize="32"
            fontWeight="700"
            fill="currentColor"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            i
          </text>
          {/* Red bar going down */}
          <rect
            x="22"
            y="8"
            width="3"
            height="12"
            fill="#ef4444"
            rx="1.5"
          />
          <polygon
            points="23.5,22 20,18 27,18"
            fill="#ef4444"
          />
        </g>

        {/* Second i with green bar (up) */}
        <g>
          <text
            x="32"
            y="30"
            fontSize="32"
            fontWeight="700"
            fill="currentColor"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            i
          </text>
          {/* Green bar going up */}
          <rect
            x="36"
            y="8"
            width="3"
            height="12"
            fill="#22c55e"
            rx="1.5"
          />
          <polygon
            points="37.5,6 34,10 41,10"
            fill="#22c55e"
          />
        </g>

        {/* e */}
        <text
          x="46"
          y="30"
          fontSize="32"
          fontWeight="700"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          e
        </text>

        {/* l */}
        <text
          x="64"
          y="30"
          fontSize="32"
          fontWeight="700"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          l
        </text>

        {/* d */}
        <text
          x="74"
          y="30"
          fontSize="32"
          fontWeight="700"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          d
        </text>
      </svg>
    </div>
  );
};

export default YiieldLogo;
