import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ThankYou from "./pages/ThankYou";
import Videos from "./pages/Videos";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { useUser } from "./hooks/useUser";
import LoadingSpinner from "./components/LoadingSpinner";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isValidating } = useUser();
  
  if (isValidating) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <LoadingSpinner size="lg" text="در حال بررسی اطلاعات کاربر..." />
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register/thank-you" element={<ThankYou />} />
            <Route 
              path="/videos" 
              element={
                <ProtectedRoute>
                  <Videos />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
