import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Lock, CheckCircle, Trophy, Star, Zap, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VideoCountdownTimer from '@/components/VideoCountdownTimer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiService, Video, UserProgress } from '@/lib/api';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';

interface VideoWithProgress extends Video {
  unlocked: boolean;
  completed: boolean;
}

const Videos = () => {
  const [videos, setVideos] = useState<VideoWithProgress[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [currentVideo, setCurrentVideo] = useState<number | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { phone, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!phone) {
      navigate('/');
      return;
    }
    loadData();
  }, [phone, navigate]);

  const loadData = async () => {
    if (!phone) return;
    
    try {
      setIsLoading(true);
      const [videosResponse, progressResponse] = await Promise.all([
        apiService.getVideos(),
        apiService.getUserProgress(phone)
      ]);

      // Merge videos with progress data
      const videosWithProgress = videosResponse.videos.map(video => {
        const progress = progressResponse.progress.find(p => p.video_id === video.id);
        return {
          ...video,
          unlocked: progress?.unlocked || false,
          completed: progress?.completed || false,
        };
      });

      setVideos(videosWithProgress);
      setUserProgress(progressResponse);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "خطا در بارگذاری اطلاعات",
        description: "لطفاً صفحه را رفرش کنید",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchVideo = (videoId: number) => {
    setCurrentVideo(videoId);
  };

  const handleCompleteVideo = async (videoId: number) => {
    if (!phone) return;

    try {
      await apiService.completeVideo(videoId, phone);
      
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { ...video, completed: true }
          : video
      ));
      
      setCurrentVideo(null);
      
      // Reload progress data
      await loadData();
      
      toast({
        title: "آفرین! ویدیو تکمیل شد 🎉",
        description: `${videos.find(v => v.id === videoId)?.points} امتیاز کسب کردی!`,
      });
    } catch (error) {
      console.error('Error completing video:', error);
      toast({
        title: "خطا در تکمیل ویدیو",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  };

  const handleCodeSubmit = async (videoId: number) => {
    if (!phone) return;

    const video = videos.find(v => v.id === videoId);
    if (video && codeInput.toUpperCase() === video.code) {
      try {
        await apiService.unlockVideo(videoId + 1, phone);
        
        setVideos(prev => prev.map(v => 
          v.id === videoId + 1 ? { ...v, unlocked: true } : v
        ));
        
        setCodeInput('');
        
        // Reload progress data
        await loadData();
        
        toast({
          title: "کد صحیح است! 🔓",
          description: "ویدیوی بعدی باز شد",
        });
      } catch (error) {
        console.error('Error unlocking video:', error);
        toast({
          title: "خطا در باز کردن ویدیو",
          description: "لطفاً دوباره تلاش کنید",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "کد اشتباه است ❌",
        description: "لطفاً دوباره تلاش کن",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLevelColor = (level: number) => {
    if (level >= 4) return "text-yellow-400";
    if (level >= 3) return "text-purple-400";
    if (level >= 2) return "text-blue-400";
    return "text-green-400";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <LoadingSpinner size="lg" text="در حال بارگذاری ویدیوها..." />
      </div>
    );
  }

  if (!phone) {
    return null;
  }

  const completedVideos = videos.filter(v => v.completed).length;
  const progress = userProgress ? userProgress.progress_percent : (completedVideos / videos.length) * 100;
  const totalPoints = userProgress ? userProgress.total_points : videos.filter(v => v.completed).reduce((sum, v) => sum + v.points, 0);
  const level = userProgress ? userProgress.level : Math.floor(totalPoints / 200) + 1;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* Header with Gamification */}
      <div className="container mx-auto mb-8">
        <Card className="bg-gradient-to-r from-primary/20 to-blue-400/20 border-2 border-primary/30 shadow-lg rounded-2xl">
          <CardContent className="py-8 px-6 flex flex-col gap-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-3xl font-bold mb-2">آکادمی MonetizeAI</h1>
                <p className="text-muted-foreground">مسیر یادگیری هوش مصنوعی و درآمدزایی</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg hover:bg-primary/10 transition"
              >
                <LogOut className="w-5 h-5" />
                خروج
              </Button>
            </div>
            <div className="flex items-center gap-8 mt-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold text-muted-foreground">سطح</span>
                <div className="flex items-center gap-2">
                  <Trophy className="w-8 h-8 text-primary bg-primary/20 rounded-full p-1" />
                  <span className="text-2xl font-extrabold text-primary">{level}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold text-muted-foreground">امتیاز</span>
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 text-green-400 bg-green-400/20 rounded-full p-1" />
                  <span className="text-2xl font-extrabold text-green-400">{totalPoints}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-[180px]">
                <div className="flex justify-between text-xs mb-1">
                  <span>پیشرفت کلی</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-4 rounded-full bg-primary/20 shadow-inner" />
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
