"use client";

import type { CSSProperties, ReactNode } from "react";

type RotatingBadgeProps = {
  badgeText: string;
  centerIcon: ReactNode;
  size?: number;
};

const buildLoopText = (text: string) => {
  return `${text} • `.repeat(4);
};

export default function RotatingBadge({
  badgeText,
  centerIcon,
  size = 140,
}: RotatingBadgeProps) {
  const ringId = `rotating-badge-text-${size}`;
  const textLoop = buildLoopText(badgeText);

  const cssVars = {
    "--badge-size": `${size}px`,
    "--badge-bg": "var(--badge-bg, #0a0a0a)",
  } as CSSProperties;

  return (
    <div className="rotating-badge__wrap" style={cssVars}>
      <style jsx>{`
        .rotating-badge__wrap {
          position: absolute;
          right: clamp(0px, 2.6vw, 26px);
          bottom: clamp(0px, 2.6vw, 26px);
          width: clamp(100px, calc(var(--badge-size) * 0.72), var(--badge-size));
          height: clamp(100px, calc(var(--badge-size) * 0.72), var(--badge-size));
          z-index: 3;
          transform: translateZ(0);
        }

        .rotating-badge__shell {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--badge-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          animation: badge-breathe 3s ease-in-out infinite;
          will-change: transform;
          transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .rotating-badge__ring {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          will-change: transform;
          animation: badge-spin 18s linear infinite;
          transform-origin: 50% 50%;
        }

        .rotating-badge__text {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          fill: #ffffff;
        }

        .rotating-badge__center {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          z-index: 1;
          pointer-events: none;
        }

        .rotating-badge__center > * {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 24px;
          line-height: 1;
        }

        .rotating-badge__wrap:hover {
          transform: scale(1.06);
        }

        .rotating-badge__wrap:hover .rotating-badge__ring {
          animation-duration: 14s;
        }

        @keyframes badge-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes badge-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rotating-badge__ring,
          .rotating-badge__shell {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="rotating-badge__shell">
        <div className="rotating-badge__ring" aria-hidden="true">
          <svg viewBox="0 0 140 140" width="100%" height="100%">
            <defs>
              <path
                id={ringId}
                d="M 70,70 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
                fill="none"
              />
            </defs>
            <text className="rotating-badge__text">
              <textPath href={`#${ringId}`} startOffset="0%">
                {textLoop}
              </textPath>
            </text>
          </svg>
        </div>

        <div className="rotating-badge__center">{centerIcon}</div>
      </div>
    </div>
  );
}
