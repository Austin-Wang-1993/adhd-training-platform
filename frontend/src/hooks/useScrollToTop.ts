import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    // 平滑滚动到页面顶部
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]); // 当路径变化时触发
} 