import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ContentId, EpisodeId, UserId } from '../shared/schema';

interface FeedCardProps {
  contentId: ContentId;
  episodeId: EpisodeId;
  title: string;
  authorId: UserId;
  authorName: string;
  thumbnailUrl: string;
  score: number;
  selectedCluster?: string;
  onBoost: (contentId: ContentId, episodeId: EpisodeId) => void;
  onSave: (contentId: ContentId, episodeId: EpisodeId) => void;
  onComment: (contentId: ContentId, episodeId: EpisodeId) => void;
  onShare: (contentId: ContentId, episodeId: EpisodeId) => void;
  // 投稿の内容（ページ）配列
  pages?: string[];
}

const FeedCard: React.FC<FeedCardProps> = ({
  contentId,
  episodeId,
  title,
  authorId,
  authorName,
  thumbnailUrl,
  score,
  selectedCluster = 'すべて',
  onBoost,
  onSave,
  onComment,
  onShare,
  pages = []
}) => {
  const [boosted, setBoosted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // スコアを5段階で表示するためのロジック
  const scoreLevel = Math.round((score / 100) * 5);
  
  // モック用のページデータ
  const mockPages = [
    thumbnailUrl, // カバー画像
    "https://images.unsplash.com/photo-1581300134629-4e3584723838?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80", // ページ1
    "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80", // ページ2
    "https://images.unsplash.com/photo-1618391877086-86a159ab0ef6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80", // ページ3
  ];
  
  const actualPages = pages.length > 0 ? pages : mockPages;
  
  // 横スワイプ検出と処理
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    let startX: number = 0;
    let currentX: number = 0;
    let isDraggingX: boolean = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      isDraggingX = true;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingX) return;
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      
      // 横スワイプで閲覧モード時のみページめくり動作
      if (isReading && Math.abs(deltaX) > 20) {
        card.style.transform = `translateX(${deltaX}px)`;
        card.style.transition = 'none';
      }
    };
    
    const handleTouchEnd = () => {
      if (!isDraggingX) return;
      const deltaX = currentX - startX;
      
      if (isReading) {
        // 横スワイプでページめくり
        if (deltaX > 70 && currentPage > 0) {
          // 右スワイプで前のページ
          goToPrevPage();
        } else if (deltaX < -70 && currentPage < actualPages.length - 1) {
          // 左スワイプで次のページ
          goToNextPage();
        } else {
          // スワイプが不十分な場合は元の位置に戻す
          card.style.transform = 'translateX(0)';
          card.style.transition = 'transform 0.3s ease';
        }
      } else if (Math.abs(deltaX) > 100) {
        // 閲覧モードへの切り替え
        setIsReading(true);
        setCurrentPage(0);
      }
      
      isDraggingX = false;
    };
    
    // イベントリスナー登録
    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchmove', handleTouchMove);
    card.addEventListener('touchend', handleTouchEnd);
    
    // クリーンアップ
    return () => {
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage, isReading, actualPages.length]);
  
  // 前のページへ
  const goToPrevPage = () => {
    if (currentPage <= 0) {
      // 最初のページで左にスワイプしたら閲覧モード終了
      setIsReading(false);
      return;
    }
    
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(100%)';
      cardRef.current.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        
        if (cardRef.current) {
          cardRef.current.style.transform = 'translateX(0)';
          cardRef.current.style.transition = 'none';
        }
      }, 300);
    }
  };
  
  // 次のページへ
  const goToNextPage = () => {
    if (currentPage >= actualPages.length - 1) return;
    
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(-100%)';
      cardRef.current.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        
        if (cardRef.current) {
          cardRef.current.style.transform = 'translateX(0)';
          cardRef.current.style.transition = 'none';
        }
      }, 300);
    }
  };
  
  const handleBoost = () => {
    onBoost(contentId, episodeId);
    setBoosted(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const handleSave = () => {
    onSave(contentId, episodeId);
    setSaved(!saved);
  };

  const handleComment = () => {
    onComment(contentId, episodeId);
  };

  const handleShare = () => {
    onShare(contentId, episodeId);
  };
  
  // 閲覧モード終了
  const handleExitReading = () => {
    setIsReading(false);
    setCurrentPage(0);
  };

  return (
    <div
      ref={cardRef} 
      className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden"
    >
      {/* フルスクリーンコンテンツ */}
      <div className="absolute inset-0">
        {/* サムネイル画像または閲覧中のページ */}
        <img 
          src={isReading ? actualPages[currentPage] : thumbnailUrl} 
          alt={isReading ? `ページ ${currentPage + 1}` : title}
          className="w-full h-full object-cover"
        />
        
        {/* 暗いオーバーレイ（閲覧モード時は表示しない） */}
        {!isReading && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
        )}
      </div>
      
      {/* 閲覧モード時のみ表示するページインジケーター */}
      {isReading && (
        <>
          <div className="absolute top-4 left-0 right-0 flex justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white">
              {currentPage + 1} / {actualPages.length}
            </div>
          </div>
          
          <button
            onClick={handleExitReading}
            className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* 横スワイプヒント */}
          <div className="absolute inset-x-0 bottom-16 flex justify-center">
            <div className="text-white/70 text-xs animate-pulse flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              スワイプして閲覧
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </>
      )}
      
      {/* 閲覧モードでない時のみ表示する情報 */}
      {!isReading && (
        <>
          {/* タイトル・作者オーバーレイ */}
          <div className="absolute bottom-20 left-4 right-14 z-10">
            <Link 
              to={`/profile/${authorId}`}
              className="flex items-center mb-3"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-white mr-3">
                <span className="text-gray-800 font-bold">{authorName.charAt(0)}</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">@{authorName}</h4>
                <p className="text-white/70 text-xs">クリエイター</p>
              </div>
            </Link>
            
            <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
            
            {/* タグ表示エリア */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                #{selectedCluster}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                #漫画
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                #人気
              </span>
            </div>
            
            {/* 横スワイプヒント */}
            <div className="mt-4 flex items-center text-white/70 text-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              横にスワイプして読む
            </div>
          </div>
          
          {/* アクションバー（縦方向・右下） */}
          <div className="absolute right-2 bottom-24 flex flex-col space-y-6 items-center">
            <div className="flex flex-col items-center">
              <button 
                onClick={handleBoost}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-black/30 backdrop-blur-sm"
                aria-label="Boost"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${boosted ? 'text-red-500' : 'text-white'}`} fill={boosted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </button>
              <span className="text-white text-xs mt-1">{boosted ? '1.2k' : '1.1k'}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <button 
                onClick={handleSave}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-black/30 backdrop-blur-sm"
                aria-label="Save"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${saved ? 'text-yellow-500' : 'text-white'}`} fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <span className="text-white text-xs mt-1">保存</span>
            </div>
            
            <div className="flex flex-col items-center">
              <button 
                onClick={handleComment}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm text-white"
                aria-label="Comment"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <span className="text-white text-xs mt-1">245</span>
            </div>
            
            <div className="flex flex-col items-center">
              <button 
                onClick={handleShare}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm text-white"
                aria-label="Share"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <span className="text-white text-xs mt-1">共有</span>
            </div>
          </div>
          
          {/* スコアメーター（下部） */}
          <div className="absolute left-0 right-0 bottom-0 px-2 py-2 flex items-center z-10">
            <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${(score / 100) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Boost成功トースト */}
          {showToast && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm z-50">
              Boosted! +1
            </div>
          )}
          
          {/* 縦スワイプヒント */}
          <div className="absolute bottom-16 right-1/2 translate-x-1/2 text-white/60 flex flex-col items-center text-xs animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="mt-1">次の投稿</span>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedCard; 