import React from 'react';
import WhatYouGetSection from '@/components/WhatYouGetSection';
import AboutAISection from '@/components/AboutAISection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CountdownSection from '@/components/CountdownSection';
import RegistrationForm from '@/components/RegistrationForm';
import FAQSection from '@/components/FAQSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <RegistrationForm />
      <WhatYouGetSection />
      <AboutAISection />
      <TestimonialsSection />
      <CountdownSection />
      <FAQSection />
    </div>
  );
};

export default Index;
