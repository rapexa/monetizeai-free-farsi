import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Calendar, Gift, ArrowRight, Clock, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

const ThankYou = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // If user is already logged in, start countdown
    if (isLoggedIn) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/videos');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoggedIn, navigate]);

  const goToVideos = () => {
    navigate('/videos');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-primary/30 ai-glow animate-fade-in">
            <CardContent className="p-8 md:p-12">
              <motion.div variants={itemVariants} className="text-center mb-8">
                <div className="w-24 h-24 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-16 h-16 text-green-400" />
          </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-primary bg-clip-text text-transparent">
              تبریک!
            </span>
            <br />
                  <span className="text-3xl md:text-4xl">ثبت‌نامت تکمیل شد</span>
          </h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            به جمع هزاران نفری که دارن با AI درآمد کسب می‌کنن، خوش اومدی!
          </p>

                {isLoggedIn && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-200">
                        انتقال خودکار به صفحه ویدیوها در {countdown} ثانیه
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 5, ease: "linear" }}
                      />
                    </div>
                  </div>
                )}

          <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 ai-glow hover:scale-105 transition-all duration-300"
                  onClick={goToVideos}
                >
                  <Video className="w-5 h-5 ml-2" />
                  مشاهده ویدیوهای دوره
                  <ArrowRight className="w-5 h-5 mr-2" />
          </Button>

                <p className="text-sm text-muted-foreground mt-4">
                  لینک‌های دسترسی به شماره شما ارسال شد
          </p>
          
              </motion.div>

              <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary/5 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary" />
            </div>
                  <h3 className="font-semibold mb-2">شماره دسترسی</h3>
                  <p className="text-sm text-muted-foreground">
                    لینک‌های دسترسی به شماره شما ارسال شد
                  </p>
            </div>

                <div className="bg-primary/5 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-primary" />
            </div>
                  <h3 className="font-semibold mb-2">زمان محدود</h3>
                  <p className="text-sm text-muted-foreground">
                    ۷۲ ساعت فرصت داری تا دوره رو تموم کنی
                  </p>
          </div>

                <div className="bg-primary/5 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">هدیه ویژه</h3>
                  <p className="text-sm text-muted-foreground">
                    با تکمیل دوره، هدیه ویژه دریافت می‌کنی
                  </p>
          </div>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
              </motion.div>
        </CardContent>
      </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYou;
