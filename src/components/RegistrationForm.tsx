import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, UserPlus, Phone, User, AlertTriangle, Users, RefreshCw, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '@/lib/api';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecoverOption, setShowRecoverOption] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simulated capacity limit
  const totalCapacity = 100;
  const currentCapacity = 87; // This would come from your backend
  const capacityPercentage = (currentCapacity / totalCapacity) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format phone number
      let formattedPhone = formData.phone;
      if (formData.phone.startsWith('0')) {
        formattedPhone = '+98' + formData.phone.substring(1);
      } else if (!formData.phone.startsWith('+98')) {
        formattedPhone = '+98' + formData.phone;
      }

      const response = await apiService.registerUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formattedPhone,
      });

      // Login the user regardless of whether they're new or existing
      localStorage.setItem('userPhone', formattedPhone);

      if (response.existing) {
        toast({
          title: "خوش برگشتی! 🎉",
          description: "اطلاعات شما از قبل ثبت شده است. به ادامه یادگیری بپردازید!",
        });
      } else {
        toast({
          title: "ثبت‌نام با موفقیت انجام شد!",
          description: "اطلاعات دسترسی به شماره شما ارسال شد",
        });
      }
      
      navigate('/register/thank-you');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.";
      if (error.message?.includes('User already exists')) {
        errorMessage = "این شماره قبلاً ثبت شده است.";
      }
      
      toast({
        title: "خطا در ثبت‌نام",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoverSession = async () => {
    if (!formData.phone.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً شماره تماس خود را وارد کنید",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Format phone number
      let formattedPhone = formData.phone;
      if (formData.phone.startsWith('0')) {
        formattedPhone = '+98' + formData.phone.substring(1);
      } else if (!formData.phone.startsWith('+98')) {
        formattedPhone = '+98' + formData.phone;
      }

      // Try to get user progress to validate the phone number
      await apiService.getUserProgress(formattedPhone);
      
      // If successful, user exists - log them in
      localStorage.setItem('userPhone', formattedPhone);
      
      toast({
        title: "جلسه بازیابی شد! 🎉",
        description: "به ادامه یادگیری خوش آمدید!",
      });
      
      navigate('/videos');
    } catch (error) {
      toast({
        title: "کاربر یافت نشد",
        description: "این شماره تماس در سیستم ثبت نشده است. لطفاً ابتدا ثبت‌نام کنید.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="registration" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                ساخت سیستم درآمد دلاری با هوش مصنوعی در ۴ روز
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              ففط تا پایان این مدت زمان داری
            </p>
          </motion.div>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/30 ai-glow animate-fade-in">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                اطلاعاتت رو وارد کن تا بتونیم لینک دسترسی رو برات ارسال کنیم
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* Capacity Indicator */}
              <div className="mb-8 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-medium">ظرفیت باقیمانده:</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {totalCapacity - currentCapacity} نفر از {totalCapacity}
                  </span>
                </div>
                <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${capacityPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-blue-400"
                  />
                </div>
                {capacityPercentage > 80 && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>ظرفیت در حال تکمیل شدن است!</span>
                  </div>
                )}
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">یا</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      نام
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="نام خود را وارد کنید"
                      required
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      نام خانوادگی
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="نام خانوادگی"
                      required
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    شماره تماس
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09xxxxxxxxx"
                    required
                    className="text-right"
                    dir="ltr"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-lg py-6 ai-glow hover:scale-105 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      در حال ثبت‌نام...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      شروع رایگان پروژه
                    </div>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  با ثبت‌نام، شرایط استفاده را می‌پذیرید
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
