import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export function Callback() {
  const navigate = useNavigate();
  const { githubAuth } = useAdmin();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        
        if (error) {
          toast.error(`GitHub 登录失败: ${error}`);
          navigate('/');
          return;
        }
        
        await githubAuth.handleCallback(params);
        toast.success('GitHub 登录成功！');
        navigate('/');
      } catch (error) {
        console.error('Callback error:', error);
        toast.error('登录失败，请重试');
        navigate('/');
      }
    };
    
    handleCallback();
  }, [githubAuth, navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">正在处理登录...</p>
      </div>
    </div>
  );
}