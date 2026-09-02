import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroSequenceProps {
  onComplete: () => void;
}

const SESSION_KEY = 'medvision_intro_seen';

export const IntroSequence: React.FC<IntroSequenceProps> = ({
  onComplete,
}) => {
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem(SESSION_KEY);

    if (hasSeenIntro) {
      onComplete();
    }
  }, [onComplete]);

  const handleVideoEnd = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.8,
          ease: 'easeInOut',
        },
      }}
      className="fixed inset-0 z-[100] bg-[#05070A] flex items-center justify-center overflow-hidden"
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-contain"
      >
        <source src="/intro/medvision-intro.mp4" type="video/mp4" />
      </video>
    </motion.div>
  );
};
