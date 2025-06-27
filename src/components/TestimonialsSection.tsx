
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "علی رضایی",
      role: "کارآفرین",
      content: "تو همین ۳ روز یاد گرفتم چطور با AI یه سرویس بسازم که ماهی ۲۰۰ دلار درآمد داره. فوق‌العاده بود!",
      rating: 5
    },
    {
      name: "مریم احمدی",
      role: "دانشجوی کامپیوتر",
      content: "هیچ تجربه‌ای نداشتم ولی الان دارم با AI پول در میارم. این پروژه زندگیم رو عوض کرد.",
      rating: 5
    },
    {
      name: "حسین کریمی",
      role: "مهندس نرم‌افزار",
      content: "فکر نمی‌کردم تو ۳ روز بتونم یه کسب‌وکار راه بندازم. MonetizeAI واقعاً کار می‌کنه!",
      rating: 5
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            تجربه‌ی بقیه شرکت‌کننده‌ها
          </h2>
          <p className="text-xl text-muted-foreground">
            ببین چی درباره این پروژه می‌گن
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-400 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="card-hover bg-card/50 backdrop-blur-sm border-primary/20 animate-slide-in-right relative overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                <div className="absolute top-4 left-4 opacity-20">
                  <Quote className="w-8 h-8 text-primary" />
                </div>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="border-t border-primary/20 pt-4">
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
