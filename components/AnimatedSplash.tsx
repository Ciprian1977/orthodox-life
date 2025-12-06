import React, { useEffect, useState } from 'react';
import { OrthodoxLifeLogo } from './OrthodoxLifeLogo';
import { RO_TEXT } from '../ro-text';

interface SplashProps {
  onFinish: () => void;
}

export const AnimatedSplash: React.FC<SplashProps> = ({ onFinish }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 100);
    const t2 = setTimeout(() => setStage(2), 800);
    const t3 = setTimeout(() => setStage(3), 1800);
    const t4 = setTimeout(onFinish, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg transition-opacity duration-700 ${stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className={`transition-all duration-1000 ease-out transform ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${stage === 2 ? 'scale-105' : ''}`}>
        <div className="relative">
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary rounded-full blur-[40px] transition-opacity duration-1000 ${stage === 2 ? 'opacity-40' : 'opacity-0'}`}></div>
           <OrthodoxLifeLogo size={80} className="relative z-10 text-primary" />
        </div>
      </div>
      
      <div className={`mt-6 font-serif text-xl text-primary font-medium tracking-wide transition-all duration-1000 delay-300 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {RO_TEXT.app.name}
      </div>
      
      <div className={`mt-2 text-text-muted text-xs uppercase tracking-[0.3em] transition-all duration-1000 delay-500 ${stage >= 1 ? 'opacity-60' : 'opacity-0'}`}>
        {RO_TEXT.app.tagline}
      </div>
    </div>
  );
};