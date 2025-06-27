import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Video, Gift, Trophy, Brain, Zap, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatYouGetSection = () => {
  const benefits = [
    {
      icon: <Brain className="w-8 h-8 text-primary" />,
      title: "یادگیری هوشمند",
      text: "یاد می‌گیری چطور با AI یک سرویس پول‌ساز بسازی و درآمد دلاری داشته باشی"
    },
    {
      icon: <Video className="w-8 h-8 text-blue-400" />,
      title: "آموزش عملی",
      text: "آموزش قدم‌به‌قدم و عملی با ویدیوهای کوتاه و تمرین‌های کاربردی"
    },
    {
      icon: <Gift className="w-8 h-8 text-green-400" />,
      title: "هدیه ویژه",
      text: "جایزه ویژه برای افرادی که کل دوره رو کامل کنن و به مرحله نهایی برسن"
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      title: "آزمون ارزیابی",
      text: "دسترسی به یک آزمون برای ورود به سیستم واقعی درآمدزایی و پشتیبانی اختصاصی"
    }
  ];

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
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            توی این ۳ روز قراره چه اتفاقی بیفته؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            یک مسیر کاملاً عملی برای ساخت اولین درآمد دلاری‌ات با AI
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-400 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="card-hover bg-card/50 backdrop-blur-sm border-primary/20 h-full">
              <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                    {benefit.icon}
                  </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                    {benefit.text}
                  </p>
                    </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-primary/10 rounded-full px-6 py-3">
            <Users className="w-6 h-6 text-primary" />
            <span className="text-lg font-medium">
              بیش از ۱۰۰۰ نفر در این مسیر موفق شدن
            </span>
        </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
