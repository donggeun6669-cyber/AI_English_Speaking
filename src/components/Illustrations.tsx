import React from 'react';

/**
 * Sam at the Lost & Found Desk Illustration (Screen 1)
 */
export const SamAtDeskIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 360 200"
        className="w-full h-full max-w-[340px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Sam standing at the school lost-and-found desk"
      >
        {/* Soft background glow */}
        <circle cx="180" cy="100" r="90" fill="#EEF2FF" />
        <rect x="30" y="170" width="300" height="4" rx="2" fill="#E2E8F0" />

        {/* Sam Character */}
        {/* Body / School Jumper */}
        <path
          d="M135 155 C135 125, 150 115, 180 115 C210 115, 225 125, 225 155 Z"
          fill="#3B82F6"
        />
        {/* Shirt Collar */}
        <path d="M165 115 L180 130 L195 115 Z" fill="#FFFFFF" />
        <path d="M180 130 L180 145" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

        {/* Volunteer Badge */}
        <rect x="190" y="132" width="22" height="14" rx="3" fill="#F59E0B" />
        <line x1="194" y1="137" x2="208" y2="137" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="194" y1="141" x2="204" y2="141" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Neck */}
        <rect x="172" y="98" width="16" height="20" rx="4" fill="#FCD34D" />

        {/* Head */}
        <ellipse cx="180" cy="85" rx="24" ry="26" fill="#FDE68A" />

        {/* Hair */}
        <path
          d="M156 80 C156 60, 168 52, 180 52 C196 52, 205 62, 204 80 C198 75, 192 74, 180 74 C168 74, 162 76, 156 80 Z"
          fill="#334155"
        />

        {/* Friendly Face */}
        {/* Glasses */}
        <circle cx="171" cy="84" r="7" stroke="#1E293B" strokeWidth="1.8" fill="none" />
        <circle cx="189" cy="84" r="7" stroke="#1E293B" strokeWidth="1.8" fill="none" />
        <line x1="178" y1="84" x2="182" y2="84" stroke="#1E293B" strokeWidth="1.8" />
        {/* Eyes */}
        <circle cx="171" cy="84" r="2.5" fill="#0F172A" />
        <circle cx="189" cy="84" r="2.5" fill="#0F172A" />
        {/* Smile */}
        <path
          d="M174 96 Q180 102 186 96"
          stroke="#B45309"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Rosy Cheeks */}
        <circle cx="163" cy="91" r="3.5" fill="#FCA5A5" opacity="0.6" />
        <circle cx="197" cy="91" r="3.5" fill="#FCA5A5" opacity="0.6" />

        {/* Waving Hand */}
        <path
          d="M135 135 C125 125, 115 110, 118 96 C120 88, 126 88, 128 94 C130 90, 134 90, 136 96 C138 92, 142 93, 142 99 L142 125 Z"
          fill="#FDE68A"
        />

        {/* School Lost & Found Counter */}
        <rect x="60" y="145" width="240" height="28" rx="6" fill="#D97706" />
        <rect x="65" y="148" width="230" height="5" rx="2" fill="#FBBF24" opacity="0.6" />
        <rect x="70" y="173" width="220" height="20" fill="#B45309" rx="2" />

        {/* Desk Signboard "LOST & FOUND" */}
        <rect x="110" y="152" width="140" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <text
          x="180"
          y="164.5"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="bold"
          fill="#1E293B"
          letterSpacing="1"
        >
          LOST & FOUND
        </text>

        {/* Stack of notebooks on desk */}
        <rect x="78" y="137" width="26" height="5" rx="1.5" fill="#10B981" />
        <rect x="80" y="132" width="24" height="5" rx="1.5" fill="#6366F1" />
        <rect x="82" y="127" width="22" height="5" rx="1.5" fill="#EC4899" />

        {/* Small desk service bell */}
        <path d="M265 145 C265 138, 275 138, 275 145 Z" fill="#F59E0B" />
        <circle cx="270" cy="137" r="1.5" fill="#D97706" />
      </svg>
    </div>
  );
};

/**
 * Sam Handing Back the Blue Bag Illustration (Screen 3)
 */
export const SamHandingBagIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 360 200"
        className="w-full h-full max-w-[340px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Sam happily handing back the blue backpack"
      >
        {/* Soft celebratory glow */}
        <circle cx="180" cy="100" r="95" fill="#EFF6FF" />

        {/* Celebration sparkles / confetti */}
        <path d="M70 65 L73 73 L81 76 L73 79 L70 87 L67 79 L59 76 L67 73 Z" fill="#FBBF24" />
        <path d="M285 55 L288 62 L295 65 L288 68 L285 75 L282 68 L275 65 L282 62 Z" fill="#60A5FA" />
        <circle cx="95" cy="45" r="3.5" fill="#F472B6" />
        <circle cx="260" cy="40" r="3.5" fill="#34D399" />
        <circle cx="295" cy="115" r="3" fill="#FBBF24" />
        <circle cx="65" cy="120" r="3" fill="#A78BFA" />

        {/* Sam Character */}
        {/* Body */}
        <path
          d="M140 135 C140 105, 155 95, 180 95 C205 95, 220 105, 220 135 Z"
          fill="#3B82F6"
        />
        <path d="M168 95 L180 110 L192 95 Z" fill="#FFFFFF" />

        {/* Neck */}
        <rect x="173" y="78" width="14" height="18" rx="3" fill="#FCD34D" />

        {/* Head */}
        <ellipse cx="180" cy="65" rx="22" ry="24" fill="#FDE68A" />

        {/* Hair */}
        <path
          d="M158 60 C158 42, 168 35, 180 35 C195 35, 202 44, 202 60 C196 55, 190 54, 180 54 C170 54, 164 56, 158 60 Z"
          fill="#334155"
        />

        {/* Happy Face (Eyes closed in big smile) */}
        <path d="M167 64 Q171 60 175 64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M185 64 Q189 60 193 64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Big Smile */}
        <path
          d="M172 74 Q180 82 188 74"
          stroke="#B45309"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cheeks */}
        <circle cx="163" cy="71" r="3.5" fill="#F87171" opacity="0.7" />
        <circle cx="197" cy="71" r="3.5" fill="#F87171" opacity="0.7" />

        {/* Arms holding the bag forward */}
        <path d="M146 115 Q145 145 160 152" stroke="#3B82F6" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M214 115 Q215 145 200 152" stroke="#3B82F6" strokeWidth="12" strokeLinecap="round" fill="none" />

        {/* The Blue Backpack (Central Hero Item) */}
        {/* Main bag body */}
        <rect x="150" y="125" width="60" height="65" rx="16" fill="#2563EB" />
        {/* Bag top handle */}
        <path d="M168 125 Q180 112 192 125" stroke="#1D4ED8" strokeWidth="4" fill="none" />

        {/* Front pocket */}
        <rect x="157" y="150" width="46" height="34" rx="8" fill="#1D4ED8" />
        {/* Zipper details */}
        <line x1="162" y1="154" x2="198" y2="154" stroke="#93C5FD" strokeWidth="2" strokeDasharray="2 1" />
        <circle cx="162" cy="154" r="2.5" fill="#FCD34D" />

        {/* Star keychain hanging from backpack */}
        <path
          d="M160 162 L162 166 L166 167 L163 170 L164 174 L160 172 L156 174 L157 170 L154 167 L158 166 Z"
          fill="#FBBF24"
        />

        {/* Counter surface below */}
        <rect x="40" y="185" width="280" height="12" rx="4" fill="#D97706" />
      </svg>
    </div>
  );
};

/**
 * Sam Avatar for speech & feedback bubbles
 */
export const SamAvatar: React.FC<{ size?: number }> = ({ size = 36 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden"
    >
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        {/* Background */}
        <circle cx="20" cy="20" r="20" fill="#DBEAFE" />
        {/* Hair */}
        <path d="M12 18 C12 11, 16 8, 20 8 C25 8, 28 11, 28 18 C26 15, 23 15, 20 15 C17 15, 14 15, 12 18 Z" fill="#334155" />
        {/* Face */}
        <circle cx="20" cy="20" r="9" fill="#FDE68A" />
        {/* Hair top */}
        <ellipse cx="20" cy="12" rx="8" ry="4" fill="#334155" />
        {/* Glasses */}
        <circle cx="17" cy="19" r="3" stroke="#1E293B" strokeWidth="1" fill="none" />
        <circle cx="23" cy="19" r="3" stroke="#1E293B" strokeWidth="1" fill="none" />
        <line x1="20" y1="19" x2="20" y2="19" stroke="#1E293B" strokeWidth="1" />
        {/* Eyes */}
        <circle cx="17" cy="19" r="1" fill="#0F172A" />
        <circle cx="23" cy="19" r="1" fill="#0F172A" />
        {/* Smile */}
        <path d="M18 24 Q20 26 22 24" stroke="#B45309" strokeWidth="1" strokeLinecap="round" fill="none" />
        {/* Shirt */}
        <path d="M10 38 C10 31, 14 28, 20 28 C26 28, 30 31, 30 38 Z" fill="#3B82F6" />
      </svg>
    </div>
  );
};
