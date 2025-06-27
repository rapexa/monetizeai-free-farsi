
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "آیا این پروژه واقعاً رایگانه؟",
      answer: "بله، این پروژه ۳ روزه کاملاً رایگان است. هیچ هزینه‌ای برای شرکت در آن نداری. فقط در انتها اگر بخوای به سیستم کامل دسترسی داشته باشی، یک پیشنهاد ویژه دریافت می‌کنی."
    },
    {
      question: "برای شرکت نیاز به مهارت قبلی دارم؟",
      answer: "خیر، اصلاً نیازی به مهارت قبلی نداری. این پروژه از صفر طراحی شده و همه چیز رو قدم به قدم یاد می‌گیری. فقط کافیه علاقه‌مند باشی و وقت بذاری."
    },
    {
      question: "چقدر زمان باید بذارم؟",
      answer: "روزی حدود ۱-۲ ساعت کافیه. کل پروژه طوری طراحی شده که بتونی در کنار کارهای روزانه‌ت انجامش بدی. ویدیوها کوتاه و عملی هستند."
    },
    {
      question: "اگه کاملش کنم چه چیزی گیرم میاد؟",
      answer: "یک سیستم کامل برای درآمدزایی با AI، دسترسی به ابزارهای ویژه، جایزه نقدی برای بهترین‌ها، و فرصت ورود به کمیونیتی خصوصی ما برای ادامه همکاری."
    },
    {
      question: "MonetizeAI چیه و چطور بهم کمک می‌کنه؟",
      answer: "MonetizeAI یک سیستم هوشمند و ربات پیشرفته‌ای است که بهت کمک می‌کنه سرویس‌های پولساز بسازی، مشتری پیدا کنی، و درآمدت رو اتوماتیک کنی. در پایان پروژه بهش دسترسی پیدا می‌کنی."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            سوالات پرتکرار
          </h2>
          <p className="text-xl text-muted-foreground">
            احتمالاً جواب سوالت اینجا هست
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-blue-400 mx-auto rounded-full mt-6"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-primary/20 animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger className="text-right hover:text-primary transition-colors text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
