import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Lock, CheckCircle, Trophy, Star, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VideoCountdownTimer from '@/components/VideoCountdownTimer';

interface Video {
  id: number;
  title: string;
  description: string;
  duration: string;
  code: string;
  unlocked: boolean;
  completed: boolean;
  points: number;
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 1,
      title: "آشنایی با هوش مصنوعی و فرصت‌های درآمدزایی",
      description: "در این ویدیو یاد می‌گیری چطور AI می‌تونه منبع درآمد باشه",
      duration: "15:30",
      code: "AI2024",
      unlocked: true,
      completed: false,
      points: 100
    },
    {
      id: 2,
      title: "ساخت اولین سرویس AI با چت بات",
      description: "قدم به قدم یک چت بات هوشمند می‌سازیم",
      duration: "22:45",
      code: "CHAT99",
      unlocked: false,
      completed: false,
      points: 150
    },
    {
      id: 3,
      title: "بازاریابی و فروش سرویس AI",
      description: "راهکارهای عملی برای پیدا کردن مشتری",
      duration: "18:20",
      code: "SELL77",
      unlocked: false,
      completed: false,
      points: 200
    },
    {
      id: 4,
      title: "اتوماسیون و مقیاس‌سازی درآمد",
      description: "چطور سیستمت رو اتوماتیک کنی و درآمدت رو چندین برابر کنی",
      duration: "25:10",
      code: "AUTO55",
      unlocked: false,
      completed: false,
      points: 250
    }
  ]);

  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const { toast } = useToast();

  const completedVideos = videos.filter(v => v.completed).length;
  const progress = (completedVideos / videos.length) * 100;

  useEffect(() => {
    const points = videos.filter(v => v.completed).reduce((sum, v) => sum + v.points, 0);
    setTotalPoints(points);
    setLevel(Math.floor(points / 200) + 1);
  }, [videos]);

  const handleWatchVideo = (videoId: number) => {
    setCurrentVideo(videoId);
  };

  const handleCompleteVideo = (videoId: number) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, completed: true }
        : video
    ));
    setCurrentVideo(null);
    toast({
      title: "آفرین! ویدیو تکمیل شد 🎉",
      description: `${videos.find(v => v.id === videoId)?.points} امتیاز کسب کردی!`,
    });
  };

  const handleCodeSubmit = (videoId: number) => {
    const video = videos.find(v => v.id === videoId);
    if (video && codeInput.toUpperCase() === video.code) {
      const nextVideoId = videoId + 1;
      setVideos(prev => prev.map(v => 
        v.id === nextVideoId ? { ...v, unlocked: true } : v
      ));
      setCodeInput('');
      toast({
        title: "کد صحیح است! 🔓",
        description: "ویدیوی بعدی باز شد",
      });
    } else {
      toast({
        title: "کد اشتباه است ❌",
        description: "لطفاً دوباره تلاش کن",
        variant: "destructive"
      });
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 4) return "text-yellow-400";
    if (level >= 3) return "text-purple-400";
    if (level >= 2) return "text-blue-400";
    return "text-green-400";
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* Header with Gamification */}
      <div className="container mx-auto mb-8">
        <Card className="bg-gradient-to-r from-primary/20 to-blue-400/20 border-primary/30 ai-glow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">آکادمی MonetizeAI</h1>
                <p className="text-muted-foreground">مسیر یادگیری هوش مصنوعی و درآمدزایی</p>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <Star className={`w-6 h-6 ${getLevelColor(level)}`} />
                      <span className="text-2xl font-bold">{totalPoints}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">امتیاز</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <Trophy className={`w-6 h-6 ${getLevelColor(level)}`} />
                      <span className="text-2xl font-bold">سطح {level}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">مرحله</p>
                  </div>
                </div>
                
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-sm mb-1">
                    <span>پیشرفت کلی</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Countdown Timer */}
      <div className="container mx-auto">
        <VideoCountdownTimer />
      </div>

      {/* Video Grid */}
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {videos.map((video, index) => (
            <Card 
              key={video.id} 
              className={`relative overflow-hidden transition-all duration-300 ${
                video.unlocked 
                  ? 'bg-card/80 backdrop-blur-sm border-primary/30 hover:scale-105 card-hover' 
                  : 'bg-muted/20 border-muted/30'
              } ${video.completed ? 'ring-2 ring-green-400/50' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                        {video.id}
                      </span>
                      {video.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={video.unlocked ? "default" : "secondary"}>
                        {video.duration}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {video.points} امتیاز
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    {video.completed && (
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    )}
                    {!video.unlocked && (
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {video.description}
                </p>

                {video.unlocked ? (
                  <div className="space-y-4">
                    {currentVideo === video.id ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                            <p className="text-lg">در حال پخش ویدیو...</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              برای شبیه‌سازی، ۳ ثانیه صبر کنید
                            </p>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleCompleteVideo(video.id)}
                          className="w-full"
                          disabled={video.completed}
                        >
                          {video.completed ? "تکمیل شده" : "اتمام ویدیو"}
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleWatchVideo(video.id)}
                        className="w-full text-lg py-6 ai-glow"
                        disabled={video.completed}
                      >
                        <Play className="w-5 h-5 ml-2" />
                        {video.completed ? "مشاهده مجدد" : "شروع یادگیری"}
                      </Button>
                    )}

                    {video.completed && index < videos.length - 1 && !videos[index + 1].unlocked && (
                      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          کد دسترسی به ویدیوی بعدی
                        </h4>
                        <div className="flex gap-2">
                          <Input
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value)}
                            placeholder="کد رمز را وارد کنید"
                            className="text-center font-mono"
                          />
                          <Button 
                            onClick={() => handleCodeSubmit(video.id)}
                            disabled={!codeInput.trim()}
                          >
                            تایید
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          کد در انتهای ویدیو نمایش داده شده است
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      ابتدا ویدیوی قبلی را تکمیل کنید
                    </p>
                  </div>
                )}
              </CardContent>

              {video.completed && (
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Videos;
