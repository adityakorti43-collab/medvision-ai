import React from 'react';
import logoIcon from '../../assets/medvision-icon.png';

interface LogoProps {
  /** Icon size in pixels */
  size?: number;
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 30, showTagline = false, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src={logoIcon}
        alt="MedVision AI"
        width={size}
        height={size}
        className="object-contain shrink-0"
        style={{ width: size, height: size }}
      />
      <div className="flex flex-col leading-none">
        <span className="font-display font-semibold tracking-tight text-white text-base sm:text-lg">
          MedVision <span className="text-cyan-400">AI</span>
        </span>
        {showTagline && (
          <span className="text-[11px] text-slate-500 tracking-wide mt-1">
            AI-powered chest X-ray screening
          </span>
        )}
      </div>
    </div>
  );
};
