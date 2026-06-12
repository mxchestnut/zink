interface GeometricOwlProps {
  className?: string;
  /** Color class for the eyes; pass a zinc tone to mute the watermark copy. */
  accentClassName?: string;
  /** Disable the slow eye-glow (for background watermarks). */
  still?: boolean;
}

/**
 * Vesper — a constellation-style geometric owl. Single-weight line work,
 * node dots on the vertices, and a dashed halo; the only filled shapes are
 * her eyes.
 */
export function GeometricOwl({
  className = "",
  accentClassName = "text-amber-300",
  still = false,
}: GeometricOwlProps) {
  const vertices: [number, number][] = [
    [58, 22],
    [142, 22],
    [100, 30],
    [50, 56],
    [150, 56],
    [46, 124],
    [154, 124],
    [52, 178],
    [148, 178],
    [74, 218],
    [126, 218],
    [100, 230],
    [26, 248],
    [174, 248],
  ];
  const stars: [number, number][] = [
    [160, 32],
    [38, 40],
    [172, 148],
    [28, 140],
  ];

  return (
    <svg viewBox="0 0 200 270" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {/* dashed halo */}
        <circle cx="100" cy="96" r="88" strokeDasharray="2 7" opacity="0.3" strokeWidth="1" />
        {/* silhouette: ear tufts, head, shoulders, wings, belly */}
        <path d="M58 22 L82 36 L100 30 L118 36 L142 22 L150 56 L144 88 L154 124 L148 178 L126 218 L100 230 L74 218 L52 178 L46 124 L56 88 L50 56 Z" />
        {/* brow lines from the tuft notches to the eyes */}
        <path d="M82 36 L76 48" />
        <path d="M118 36 L124 48" />
        {/* beak */}
        <path d="M100 78 L90 86 L100 102 L110 86 Z" />
        {/* facial disc */}
        <path d="M56 88 L90 86" />
        <path d="M144 88 L110 86" />
        {/* breast-feather chevrons */}
        <path d="M78 130 L100 148 L122 130" />
        <path d="M84 160 L100 176 L116 160" />
        <path d="M90 190 L100 204 L110 190" />
        {/* folded-wing creases */}
        <path d="M56 120 L66 170 L84 210" />
        <path d="M144 120 L134 170 L116 210" />
        {/* tail, talons, perch */}
        <path d="M92 233 L100 262 L108 233" />
        <path d="M88 230 L84 248 M96 230 L94 248" />
        <path d="M112 230 L116 248 M104 230 L106 248" />
        <path d="M26 248 L174 248" />
        <path d="M152 248 L166 260" />
      </g>
      {/* constellation nodes */}
      <g fill="currentColor">
        {vertices.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" />
        ))}
        {stars.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" opacity="0.6" />
        ))}
      </g>
      {/* the eyes — the only thing she fills in */}
      <g className={`${accentClassName} ${still ? "" : "owl-gaze"}`} stroke="currentColor">
        <circle cx="76" cy="64" r="16" strokeWidth="1.5" />
        <circle cx="124" cy="64" r="16" strokeWidth="1.5" />
        <circle cx="76" cy="64" r="5" fill="currentColor" stroke="none" />
        <circle cx="124" cy="64" r="5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
