import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigate } from "react-router-dom";
import Index from "./pages/Index.tsx";
import HeritageList from "./pages/HeritageList.tsx";
import HeritageDetail from "./pages/HeritageDetail.tsx";
import MapPage from "./pages/MapPage.tsx";
import AIChat from "./pages/AIChat.tsx";
import Admin from "./pages/Admin.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import Contribute from "./pages/Contribute.tsx";

const queryClient = new QueryClient();

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <Navigate to="/dang-nhap" replace />;
  const user = JSON.parse(userStr);
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
};

const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <Navigate to="/dang-nhap" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/di-san" element={<HeritageList />} />
          <Route path="/di-san/:slug" element={<HeritageDetail />} />
          <Route path="/ban-do" element={<MapPage />} />
          <Route path="/tro-ly-ai" element={<AIChat />} />
          <Route path="/dang-nhap" element={<Auth />} />
          
          <Route path="/dong-gop" element={
            <ProtectedUserRoute>
              <Contribute />
            </ProtectedUserRoute>
          } />
          
          <Route path="/quan-tri" element={
            <ProtectedAdminRoute>
              <Admin />
            </ProtectedAdminRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
