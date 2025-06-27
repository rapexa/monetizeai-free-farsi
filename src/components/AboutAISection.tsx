
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Zap, Target } from 'lucide-react';

const AboutAISection = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              این فقط یه دوره رایگان نیست،
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                این شروع یه سیستم جدیه
              </span>
            </h2>

            <Card className="bg-card/30 backdrop-blur-sm border-primary/30 ai-glow">
              <CardContent className="p-12">
                <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground mb-8">
                  این پروژه طوری طراحی شده که ذهنت رو درگیر کنه، مسیر رو نشونت بده و اگر واقعاً بخوای، 
                  تبدیل شی به یکی از کسانی که با AI به درآمد دلاری رسیدن.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">تفکر استراتژیک</h3>
                    <p className="text-muted-foreground">ذهنت رو برای فرصت‌های AI آماده می‌کنیم</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">اقدام سریع</h3>
                    <p className="text-muted-foreground">بلافاصله شروع به ساخت و کسب درآمد می‌کنی</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">نتیجه مطمئن</h3>
                    <p className="text-muted-foreground">با سیستم اثبات شده به هدفت می‌رسی</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAISection;
