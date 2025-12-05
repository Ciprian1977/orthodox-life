
import React, { useEffect, useState } from 'react';
import { OrthodoxLifeLogo } from './OrthodoxLifeLogo';
import { useI18n } from '../contexts/I18nContext';

interface SplashProps {
  onFinish: () => void;
}

export const AnimatedSplash: React.FC<SplashProps> = ({ onFinish }) => {
  const { t } = useI18n();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Fade In (0ms)
    const t1 = setTimeout(() => setStage(1), 100);
    // Stage 2: Pulse/Halo (700ms)
    const t2 = setTimeout(() => setStage(2), 800);
    // Stage 3: Fade Out (1800ms)
    const t3 = setTimeout(() => setStage(3), 1800);
    // Finish (2200ms)
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
           {/* Halo Effect */}
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary rounded-full blur-[40px] transition-opacity duration-1000 ${stage === 2 ? 'opacity-40' : 'opacity-0'}`}></div>
           <OrthodoxLifeLogo size={80} className="relative z-10 text-primary" />
        </div>
      </div>
      
      <div className={`mt-6 font-serif text-xl text-primary font-medium tracking-wide transition-all duration-1000 delay-300 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {t('app.name')}
      </div>
      
      <div className={`mt-2 text-text-muted text-xs uppercase tracking-[0.3em] transition-all duration-1000 delay-500 ${stage >= 1 ? 'opacity-60' : 'opacity-0'}`}>
        {t('app.tagline')}
      </div>
    </div>
  );
};
