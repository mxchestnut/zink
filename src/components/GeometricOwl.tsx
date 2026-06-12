interface GeometricOwlProps {
  className?: string;
  /** Color class for the eye rings; pass a zinc tone to mute the watermark copy. */
  accentClassName?: string;
  /** Disable the slow eye-glow (for background watermarks). */
  still?: boolean;
}

/**
 * The Owl — a constellation-style geometric barn owl, matching Zink's mask:
 * heart-shaped facial disc, dark eyes, no ear tufts. Single-weight line
 * work, node dots on the vertices, and a dashed halo.
 */
export function GeometricOwl({
  className = "",
  accentClassName = "text-amber-300",
  still = false,
}: GeometricOwlProps) {
  const vertices: [number, number][] = [
    [100, 12],
    [62, 30],
    [138, 30],
    [58, 54],
    [142, 54],
    [100, 106],
    [48, 108],
    [152, 108],
    [54, 176],
    [146, 176],
    [76, 218],
    [124, 218],
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
        {/* silhouette: rounded crown, shoulders, folded wings, belly */}
        <path d="M58 54 L62 30 L78 16 L100 12 L122 16 L138 30 L142 54 L152 108 L146 176 L124 218 L100 230 L76 218 L54 176 L48 108 Z" />
        {/* the heart-shaped facial disc */}
        <path d="M100 42 L78 32 L62 54 L70 84 L100 106 L130 84 L138 54 L122 32 Z" />
        {/* center ridge from brow dip to beak */}
        <path d="M100 42 L100 74" />
        {/* beak */}
        <path d="M100 74 L95 82 L100 96 L105 82 Z" />
        {/* breast-feather chevrons */}
        <path d="M78 132 L100 150 L122 132" />
        <path d="M84 162 L100 178 L116 162" />
        <path d="M90 192 L100 206 L110 192" />
        {/* folded-wing creases */}
        <path d="M56 112 L66 168 L84 210" />
        <path d="M144 112 L134 168 L116 210" />
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
      {/* barn-owl eyes: dark behind thin rings, a glint of light in each */}
      <g className={`${accentClassName} ${still ? "" : "owl-gaze"}`} stroke="currentColor">
        <circle cx="81" cy="60" r="8" strokeWidth="1.5" />
        <circle cx="119" cy="60" r="8" strokeWidth="1.5" />
        <circle cx="81" cy="60" r="2.6" fill="currentColor" stroke="none" />
        <circle cx="119" cy="60" r="2.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
