import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  
  // 現在のパスからアクティブタブを設定
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/feed') {
      setActiveTab('home');
    } else if (path.includes('/ranking')) {
      setActiveTab('ranking');
    } else if (path === '/upload') {
      setActiveTab('upload');
    } else if (path.includes('/notifications')) {
      setActiveTab('notifications');
    } else if (path.includes('/profile')) {
      setActiveTab('profile');
    } else if (path.includes('/settings')) {
      setActiveTab('settings');
    }
  }, [location.pathname]);
  
  // 各タブへのナビゲーション
  const navigateTo = (route: string) => {
    navigate(route);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <div className="flex justify-around items-center py-2 px-2">
        {/* ホーム */}
        <button 
          onClick={() => navigateTo('/')}
          className="flex flex-col items-center justify-center py-1 px-3"
          aria-label="ホーム"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 ${activeTab === 'home' ? 'text-primary' : 'text-gray-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={activeTab === 'home' ? 2.5 : 1.5} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
          <span className={`text-xs mt-1 ${activeTab === 'home' ? 'text-primary font-medium' : 'text-gray-400'}`}>
            ホーム
          </span>
        </button>
        
        {/* ランキング */}
        <button 
          onClick={() => navigateTo('/ranking')}
          className="flex flex-col items-center justify-center py-1 px-3"
          aria-label="ランキング"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 ${activeTab === 'ranking' ? 'text-primary' : 'text-gray-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={activeTab === 'ranking' ? 2.5 : 1.5} 
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
            />
          </svg>
          <span className={`text-xs mt-1 ${activeTab === 'ranking' ? 'text-primary font-medium' : 'text-gray-400'}`}>
            ランキング
          </span>
        </button>
        
        {/* 投稿 (中央の大きなボタン) */}
        <button 
          onClick={() => navigateTo('/upload')}
          className="flex flex-col items-center justify-center"
          aria-label="投稿作成"
        >
          <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-500 shadow-lg transform ${activeTab === 'upload' ? 'scale-110' : ''}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </div>
        </button>
        
        {/* 通知 */}
        <button 
          onClick={() => navigateTo('/notifications')}
          className="flex flex-col items-center justify-center py-1 px-3 relative"
          aria-label="通知"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 ${activeTab === 'notifications' ? 'text-primary' : 'text-gray-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={activeTab === 'notifications' ? 2.5 : 1.5} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
            />
          </svg>
          {/* 未読バッジ */}
          <div className="absolute top-0 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">3</span>
          </div>
          <span className={`text-xs mt-1 ${activeTab === 'notifications' ? 'text-primary font-medium' : 'text-gray-400'}`}>
            通知
          </span>
        </button>
        
        {/* 設定 */}
        <button 
          onClick={() => navigateTo('/settings')}
          className="flex flex-col items-center justify-center py-1 px-3"
          aria-label="設定"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 ${activeTab === 'settings' ? 'text-primary' : 'text-gray-400'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={activeTab === 'settings' ? 2.5 : 1.5} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={activeTab === 'settings' ? 2.5 : 1.5} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <span className={`text-xs mt-1 ${activeTab === 'settings' ? 'text-primary font-medium' : 'text-gray-400'}`}>
            設定
          </span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation; 