// My cartoon avatar (spiky black hair, square black glasses, grey headphones, dark zip hoodie),
// drawn as a full figure sitting on the top edge of the contact card: laptop on the lap, legs
// swinging over the front of the card, and a wave whenever the "Hi there" bubble pops up.
// Pure SVG + CSS animation (see .sit in styles.css); decorative, so hidden from screen readers.
// The seat line (the card's top edge) is y = 150 in the 200 x 250 viewBox.
const SKIN = '#f4d8c0';
const SKIN_SHADE = '#e2bc9e';
const HAIR = '#121214';
const HOODIE = '#3b3b41';
const HOODIE_SHADE = '#2e2e33';
const JEANS = '#34466f';

export default function SitAvatar() {
  return (
    <div className="sit" aria-hidden="true">
      <span className="sit-bubble">Hi there 👋</span>
      <svg viewBox="0 0 200 250" className="sit-svg">
        <defs>
          <linearGradient id="sit-lid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f6fa" />
            <stop offset="1" stopColor="#d3d9e4" />
          </linearGradient>
          <linearGradient id="sit-cup" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a3a3a8" />
            <stop offset="1" stopColor="#77777d" />
          </linearGradient>
        </defs>

        {/* soft shadow where I sit */}
        <ellipse cx="100" cy="151" rx="48" ry="4.5" fill="#0b0720" opacity=".22" />

        {/* lower legs swing from the knee: jeans and white sneakers */}
        <g className="sit-leg sit-leg--l">
          <rect x="74" y="146" width="20" height="44" rx="8" fill={JEANS} />
          <path d="M80 150 v36" stroke="#2a3a60" strokeWidth="1.5" />
          <path d="M68 189 h25 a6 6 0 0 1 6 6 v4 a3 3 0 0 1 -3 3 h-31 a5 5 0 0 1 -5 -5 v-1 a7 7 0 0 1 8 -7z" fill="#ffffff" />
          <path d="M71 193 h10" stroke="#c9ccd8" strokeWidth="2" strokeLinecap="round" />
          <rect x="59" y="200" width="41" height="4" rx="2" fill="#b8bcc9" />
        </g>
        <g className="sit-leg sit-leg--r">
          <rect x="106" y="146" width="20" height="44" rx="8" fill={JEANS} />
          <path d="M120 150 v36" stroke="#2a3a60" strokeWidth="1.5" />
          <path d="M107 189 h25 a7 7 0 0 1 8 7 v1 a5 5 0 0 1 -5 5 h-31 a3 3 0 0 1 -3 -3 v-4 a6 6 0 0 1 6 -6z" fill="#ffffff" />
          <path d="M129 193 h-10" stroke="#c9ccd8" strokeWidth="2" strokeLinecap="round" />
          <rect x="100" y="200" width="41" height="4" rx="2" fill="#b8bcc9" />
        </g>
        {/* knees on the edge */}
        <rect x="69" y="133" width="29" height="22" rx="11" fill={JEANS} />
        <rect x="102" y="133" width="29" height="22" rx="11" fill="#2f4066" />

        <g className="sit-top">
          {/* dark zip hoodie */}
          <path d="M55 146 C53 116 60 100 78 95 L100 92 L122 95 C140 100 147 116 145 146 Z" fill={HOODIE} />
          <path d="M122 95 C140 100 147 116 145 146 L133 146 C135 123 131 107 122 95Z" fill={HOODIE_SHADE} />
          <path d="M80 84 C86 92 94 95 100 95 C106 95 114 92 120 84 L124 95 C116 101 108 103 100 103 C92 103 84 101 76 95Z" fill={HOODIE_SHADE} />
          <path d="M100 96 V146" stroke="#d9dbe3" strokeWidth="2" strokeDasharray="2.4 2.4" />
          <rect x="98" y="98" width="4" height="7" rx="1.5" fill="#d9dbe3" />

          <g className="sit-head">
            {/* headphone cups sit at the sides of the head */}
            <rect x="57" y="44" width="16" height="32" rx="7" fill="url(#sit-cup)" />
            <rect x="127" y="44" width="16" height="32" rx="7" fill="url(#sit-cup)" />
            <rect x="66" y="47" width="6" height="26" rx="3" fill="#5c5c62" />
            <rect x="128" y="47" width="6" height="26" rx="3" fill="#5c5c62" />
            {/* face: a wide, rounded square */}
            <rect x="68" y="24" width="64" height="62" rx="27" fill={SKIN} />
            <path d="M76 74 C84 84 92 86 100 86 C108 86 116 84 124 74 C116 80 108 82 100 82 C92 82 84 80 76 74Z" fill={SKIN_SHADE} opacity=".7" />
            {/* spiky hair, swept up and to the left */}
            <path d="M66 54 C64 40 69 29 79 23 L66 14 L84 16 L76 3 L94 12 L95 0 L106 12 L113 5 L114 16 C127 19 135 31 134 46 L134 54 C131 44 126 39 118 37 C105 33 89 35 77 41 C72 44 68 49 66 54Z" fill={HAIR} />
            {/* headphone band over the hair */}
            <path d="M64 50 C62 26 80 14 100 14 C120 14 138 26 136 50" stroke="#45454b" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* eyes behind thick square glasses */}
            <g className="sit-eyes">
              <ellipse cx="86" cy="55" rx="3.4" ry="3.6" fill="#3a2418" />
              <ellipse cx="114" cy="55" rx="3.4" ry="3.6" fill="#3a2418" />
            </g>
            <rect x="74" y="45" width="24" height="20" rx="5" fill="#ffffff" fillOpacity=".12" stroke={HAIR} strokeWidth="4.6" />
            <rect x="102" y="45" width="24" height="20" rx="5" fill="#ffffff" fillOpacity=".12" stroke={HAIR} strokeWidth="4.6" />
            <path d="M98 53 H102" stroke={HAIR} strokeWidth="4" />
            <path d="M74 52 H70 M126 52 H130" stroke={HAIR} strokeWidth="3.6" strokeLinecap="round" />
            {/* nose and smile */}
            <path d="M99 66 q2 2.5 4 0" stroke={SKIN_SHADE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M91 72 Q100 80 109 72" stroke="#3b2418" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </g>

          {/* left arm resting on the laptop */}
          <path d="M61 106 C52 118 52 132 60 140 L71 134 C66 126 67 117 73 110Z" fill={HOODIE} />
          {/* laptop */}
          <rect x="57" y="113" width="86" height="33" rx="6" fill="url(#sit-lid)" />
          <circle cx="100" cy="129.5" r="5" fill="#8b5cf6" className="sit-logo" />
          <ellipse cx="64" cy="139" rx="6.5" ry="5.5" fill={SKIN} />
          <rect x="50" y="144" width="100" height="6" rx="3" fill="#a9b1c4" />

          {/* right arm: resting, swapped for a raised, waving arm */}
          <g className="sit-rest">
            <path d="M139 106 C148 118 148 132 140 140 L129 134 C134 126 133 117 127 110Z" fill={HOODIE_SHADE} />
            <ellipse cx="136" cy="139" rx="6.5" ry="5.5" fill={SKIN} />
          </g>
          <g className="sit-wave">
            <path d="M132 104 C141 94 147 82 149 70 L161 72 C159 86 152 100 142 112Z" fill={HOODIE_SHADE} />
            <path d="M148 68 C146 60 147 50 151 46 L153 56 L154 43 C156 41 159 41 160 43 L159 56 L162 45 C164 43 167 44 167 46 L164 58 L168 52 C170 50 173 52 172 55 L165 69 C161 74 153 74 148 68Z" fill={SKIN} />
          </g>
        </g>
        <path className="sit-spark" d="M30 44 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#8b5cf6" />
        <path className="sit-spark sit-spark--2" d="M176 112 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#22d3ee" />
      </svg>
    </div>
  );
}
