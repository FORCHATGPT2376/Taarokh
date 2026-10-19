/** Original technical diagrams for the size guide (inline SVG, scalable). */
const ink = "#171717";
const gold = "#7d6438";

export function LugDiagram() {
  return (
    <svg viewBox="0 0 520 420" className="h-auto w-full" role="img" aria-labelledby="lug-t lug-d">
      <title id="lug-t">Diagram: measuring lug width</title>
      <desc id="lug-d">Top view of a watch case. The lug width is the inside distance between the two lugs where the strap attaches, shown here as 20 millimetres.</desc>
      <g fill="none" stroke={ink} strokeWidth="1.2">
        <rect x="190" y="40" width="140" height="70" fill="#E3D8C5" stroke="none" />
        <path d="M150 140 L156 52 Q160 40 172 42 L180 44 L186 150" />
        <path d="M370 140 L364 52 Q360 40 348 42 L340 44 L334 150" />
        <circle cx="260" cy="250" r="125" />
        <circle cx="260" cy="250" r="108" strokeWidth="0.6" />
        <rect x="383" y="236" width="18" height="28" rx="3" />
        <line x1="186" y1="96" x2="334" y2="96" strokeDasharray="3 4" strokeWidth="0.8" />
      </g>
      <g stroke={gold} strokeWidth="1.2">
        <line x1="186" y1="18" x2="186" y2="88" />
        <line x1="334" y1="18" x2="334" y2="88" />
        <line x1="190" y1="26" x2="330" y2="26" />
        <path d="M190 26 l8 -4 v8z M330 26 l-8 -4 v8z" fill={gold} />
      </g>
      <text x="260" y="16" textAnchor="middle" className="font-sans" fontSize="13" letterSpacing="2" fill={gold}>LUG WIDTH · e.g. 20 mm</text>
      <text x="260" y="128" textAnchor="middle" className="font-sans" fontSize="10" letterSpacing="1.5" fill={ink} opacity="0.6">SPRING BAR</text>
      <text x="260" y="255" textAnchor="middle" className="font-serif" fontSize="22" fill={ink} opacity="0.7">case</text>
    </svg>
  );
}

export function StrapDiagram() {
  return (
    <svg viewBox="0 0 600 230" className="h-auto w-full" role="img" aria-labelledby="strap-t strap-d">
      <title id="strap-t">Diagram: strap length and taper</title>
      <desc id="strap-d">A two-piece strap: the long piece with holes, about 115 millimetres, and the buckle piece, about 75 millimetres. The strap tapers from 20 millimetres at the lugs to 18 millimetres at the buckle.</desc>
      <g fill="#E3D8C5" stroke={ink} strokeWidth="1">
        <path d="M20 60 L20 100 L230 98 L250 96 Q262 80 250 64 L230 62 Z" />
        <path d="M330 60 L330 100 L470 98 L470 62 Z" />
      </g>
      <g fill={ink}>{[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={120 + i * 20} cy="80" rx="3" ry="4" />)}</g>
      <g fill="none" stroke={ink}>
        <rect x="470" y="54" width="44" height="52" rx="10" strokeWidth="2" />
        <line x1="470" y1="80" x2="508" y2="80" strokeWidth="2" />
        <rect x="430" y="56" width="10" height="48" fill="#cdbb9c" strokeWidth="0.8" />
        <rect x="448" y="56" width="10" height="48" fill="#cdbb9c" strokeWidth="0.8" />
      </g>
      <g stroke={gold} strokeWidth="1" fill="none">
        <line x1="20" y1="140" x2="252" y2="140" />
        <line x1="330" y1="140" x2="470" y2="140" />
        <line x1="20" y1="132" x2="20" y2="148" /><line x1="252" y1="132" x2="252" y2="148" />
        <line x1="330" y1="132" x2="330" y2="148" /><line x1="470" y1="132" x2="470" y2="148" />
        <line x1="8" y1="60" x2="8" y2="100" /><line x1="3" y1="60" x2="13" y2="60" /><line x1="3" y1="100" x2="13" y2="100" />
        <line x1="482" y1="62" x2="482" y2="98" strokeDasharray="2 2" />
      </g>
      <g className="font-sans" fontSize="11" letterSpacing="1.5" fill={gold}>
        <text x="136" y="164" textAnchor="middle">LONG PIECE ≈ 115 mm</text>
        <text x="400" y="164" textAnchor="middle">BUCKLE PIECE ≈ 75 mm</text>
        <text x="20" y="40">20 mm AT LUG</text>
        <text x="420" y="40">18 mm AT BUCKLE</text>
      </g>
      <text x="300" y="205" textAnchor="middle" className="font-sans" fontSize="10" letterSpacing="1.2" fill={ink} opacity="0.55">TARGET DIMENSIONS · CONFIRMED ON FINISHED SAMPLES</text>
    </svg>
  );
}

export function SpringBarDiagram() {
  return (
    <svg viewBox="0 0 520 200" className="h-auto w-full" role="img" aria-labelledby="sb-t sb-d">
      <title id="sb-t">Diagram: standard and quick-release spring bars</title>
      <desc id="sb-d">Two spring bars. A standard bar has spring-loaded tips at each end and is compressed with a tool. A quick-release bar adds a small lever that retracts the tip by hand.</desc>
      <g fill="none" stroke={ink} strokeWidth="1.2">
        <rect x="40" y="50" width="200" height="14" rx="7" fill="#d8d6d0" />
        <rect x="26" y="53" width="16" height="8" rx="4" fill="#d8d6d0" />
        <rect x="238" y="53" width="16" height="8" rx="4" fill="#d8d6d0" />
        <rect x="290" y="50" width="200" height="14" rx="7" fill="#d8d6d0" />
        <rect x="276" y="53" width="16" height="8" rx="4" fill="#d8d6d0" />
        <rect x="488" y="53" width="16" height="8" rx="4" fill="#d8d6d0" />
        <path d="M430 64 L430 84 L446 84" strokeWidth="2" />
      </g>
      <g stroke={gold} strokeWidth="1">
        <path d="M34 80 L34 96 M246 80 L246 96" />
        <path d="M430 92 L430 112" />
      </g>
      <g className="font-sans" fontSize="11" letterSpacing="1.5" fill={gold} textAnchor="middle">
        <text x="140" y="30">STANDARD SPRING BAR</text>
        <text x="390" y="30">QUICK-RELEASE</text>
        <text x="140" y="118">tips compress with a spring-bar tool</text>
        <text x="430" y="130">lever retracts the tip by hand</text>
      </g>
    </svg>
  );
}
