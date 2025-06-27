
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle } from 'lucide-react';

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        let newDays = prev.days;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        if (newHours < 0) {
          newHours = 23;
          newDays -= 1;
        }
        if (newDays < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToRegistration = () => {
    const element = document.getElementById('final-cta');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border-red-500/30 ai-glow animate-fade-in">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <h2 className="text-3xl md:text-4xl font-bold">
                مهلت ثبت‌نام توی این پروژه خیلی محدوده
              </h2>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <p className="text-xl text-muted-foreground mb-8">
              فقط تا پایان این مدت زمان داری
            </p>

            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-primary/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">{timeLeft.days}</div>
                <div className="text-sm text-muted-foreground">روز</div>
              </div>
              <div className="bg-primary/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">{timeLeft.hours}</div>
                <div className="text-sm text-muted-foreground">ساعت</div>
              </div>
              <div className="bg-primary/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">{timeLeft.minutes}</div>
                <div className="text-sm text-muted-foreground">دقیقه</div>
              </div>
              <div className="bg-primary/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">{timeLeft.seconds}</div>
                <div className="text-sm text-muted-foreground">ثانیه</div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-red-500 hover:bg-red-600 ai-glow animate-pulse"
              onClick={scrollToRegistration}
            >
              <Clock className="w-5 h-5 ml-2" />
              همین الان ثبت‌نام کن
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CountdownSection;
