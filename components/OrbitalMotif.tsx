/* meishiki OS — Orbital Blueprint motif
   楕円軌道（実線＋破線）＋ 紫/金惑星ドット。CSSアニメで回転。 */
export default function OrbitalMotif() {
  return (
    <div className="relative w-[240px] h-[240px] select-none">
      <svg viewBox="0 0 240 240" className="absolute inset-0 w-full h-full">
        {/* 製図グリッド（薄い） */}
        <line x1="0"   y1="120" x2="240" y2="120" stroke="#D8D2C5" strokeWidth="0.3" />
        <line x1="120" y1="0"   x2="120" y2="240" stroke="#D8D2C5" strokeWidth="0.3" />

        {/* center sun */}
        <circle cx="120" cy="120" r="2.5" fill="#0C0A08" />
        <circle cx="120" cy="120" r="6"   fill="none" stroke="#0C0A08" strokeWidth="0.4" />

        {/* orbit 1: solid ellipse, slow rotation */}
        <g style={{ transformOrigin: "120px 120px", animation: "orbit 36s linear infinite" }}>
          <ellipse cx="120" cy="120" rx="92" ry="56" stroke="#0C0A08" strokeWidth="0.5" fill="none" />
          {/* purple planet at orbit edge */}
          <circle cx="212" cy="120" r="9"   fill="#6D28D9" opacity="0.18" />
          <circle cx="212" cy="120" r="3.5" fill="#6D28D9" />
        </g>

        {/* orbit 2: dashed ellipse, reverse, medium */}
        <g style={{ transformOrigin: "120px 120px", animation: "orbit-reverse 26s linear infinite" }}>
          <ellipse
            cx="120" cy="120" rx="58" ry="100"
            stroke="#888272" strokeWidth="0.4" strokeDasharray="3 5" fill="none"
            transform="rotate(20 120 120)"
          />
          {/* gold planet */}
          <g transform="rotate(20 120 120)">
            <circle cx="120" cy="20" r="7"   fill="#B8860B" opacity="0.16" />
            <circle cx="120" cy="20" r="2.8" fill="#B8860B" />
          </g>
        </g>

        {/* orbit 3: small inner ellipse */}
        <g style={{ transformOrigin: "120px 120px", animation: "orbit 18s linear infinite" }}>
          <ellipse cx="120" cy="120" rx="38" ry="58" stroke="#0C0A08" strokeWidth="0.35" fill="none" />
          <circle cx="158" cy="120" r="2" fill="#0C0A08" />
        </g>

        {/* corner coordinates (DM Mono風 / 製図) */}
        <text x="6"   y="10"  fontSize="6" fill="#888272" fontFamily="ui-monospace, SFMono-Regular, monospace" letterSpacing="0.15em">N00·24</text>
        <text x="195" y="10"  fontSize="6" fill="#888272" fontFamily="ui-monospace, SFMono-Regular, monospace" letterSpacing="0.15em">E00·00</text>
        <text x="6"   y="236" fontSize="6" fill="#888272" fontFamily="ui-monospace, SFMono-Regular, monospace" letterSpacing="0.15em">S00·24</text>
        <text x="195" y="236" fontSize="6" fill="#888272" fontFamily="ui-monospace, SFMono-Regular, monospace" letterSpacing="0.15em">W00·00</text>
      </svg>
    </div>
  );
}
