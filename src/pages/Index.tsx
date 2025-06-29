import React from 'react';
import WhatYouGetSection from '@/components/WhatYouGetSection';
import AboutAISection from '@/components/AboutAISection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CountdownSection from '@/components/CountdownSection';
import RegistrationForm from '@/components/RegistrationForm';
import FAQSection from '@/components/FAQSection';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Video, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();

  const handleContinueLearning = () => {
    navigate('/videos');
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {isLoggedIn && (
        <div className="fixed top-4 right-4 z-50">
          <Button 
            onClick={handleContinueLearning}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg"
          >
            <Video className="w-4 h-4 ml-2" />
            ادامه یادگیری
            <ArrowRight className="w-4 h-4 mr-2" />
          </Button>
        </div>
      )}
      
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
