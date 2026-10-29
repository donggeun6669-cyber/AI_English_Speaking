import React from 'react';

/**
 * Illustrations made in Google Stitch (2026-10-29), served from public/images.
 */

/**
 * Sam at the Lost & Found Desk Illustration (Screen 1)
 */
export const SamAtDeskIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/images/sam-desk.jpg"
        alt="Sam waving hello behind the school lost-and-found desk"
        className="h-full w-auto max-w-full rounded-2xl object-cover shadow-sm"
        draggable={false}
      />
    </div>
  );
};

/**
 * Sam Handing Back the Blue Bag Illustration (Screen 3)
 */
export const SamHandingBagIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/images/sam-bag.jpg"
        alt="Sam happily handing back the blue backpack"
        className="h-full w-auto max-w-full rounded-2xl object-cover shadow-sm"
        draggable={false}
      />
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
      <img
        src="/images/sam-face.jpg"
        alt="Sam"
        className="w-full h-full object-cover scale-[1.18]"
        draggable={false}
      />
    </div>
  );
};
