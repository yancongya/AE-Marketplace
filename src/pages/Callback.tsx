import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export function Callback() {
  const navigate = useNavigate();
  const { githubAuth } = useAdmin();
  
  useEffect(() => {
    const handleCallback = async () => {
      console.log('Callback: Starting OAuth callback handling');
      
      try {
        const params = new URLSearchParams(window.location.search);
        console.log('Callback: URL params received:', {
          hasCode: !!params.get('code'),
          hasState: !!params.get('state'),
          hasError: !!params.get('error'),
        });
        
        const error = params.get('error');
        
        if (error) {
          console.error('Callback: OAuth error received:', error);
          toast.error(`GitHub 登录失败: ${error}`);
          navigate('/');
          return;
        }
        
        console.log('Callback: Calling handleCallback');
        const accessToken = await githubAuth.handleCallback(params);
        console.log('Callback: Access token received:', accessToken ? `${accessToken.substring(0, 10)}...` : 'null');
        
        toast.success('GitHub 登录成功！');
        
        // 等待一小段时间，确保状态更新
        setTimeout(() => {
          console.log('Callback: Navigating to home');
          navigate('/');
        }, 200);
      } catch (error) {
        console.error('Callback error:', error);
        toast.error('登录失败，请重试');
        setTimeout(() => {
          navigate('/');
        }, 1000);
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