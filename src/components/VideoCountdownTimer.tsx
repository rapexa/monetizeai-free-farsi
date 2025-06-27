import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const VideoCountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 72); // 72 hours from now

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'روز', value: timeLeft.days },
    { label: 'ساعت', value: timeLeft.hours },
    { label: 'دقیقه', value: timeLeft.minutes },
    { label: 'ثانیه', value: timeLeft.seconds }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mb-8"
    >
      <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30 overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="p-2 sm:p-3 bg-red-500/20 rounded-full">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">زمان باقی‌مانده برای دسترسی</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">شما ۷۲ ساعت فرصت دارید تا دوره را تکمیل کنید</p>
                </div>
              </div>
            </div>

            {/* Timer Blocks - More compact for desktop */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {timeBlocks.map((block, index) => (
                <motion.div
                  key={block.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                      {block.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">{block.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Warning Message */}
            {timeLeft.days === 0 && timeLeft.hours < 24 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-full text-sm sm:text-base"
              >
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">کمتر از ۲۴ ساعت باقی مانده!</span>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VideoCountdownTimer; 