import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedCard from '../components/FeedCard';
import { ContentId, EpisodeId } from '../shared/schema';

// フィードアイテム型定義
interface FeedItem {
  feedId: string;
  contentId: ContentId;
  episodeId: EpisodeId;
  title: string;
  authorId: string;
  authorName: string;
  thumbnailUrl: string;
  score: number;
  pages?: string[]; // 投稿内のページ配列
}

// クラスタ型定義
interface Cluster {
  id: string;
  name: string;
}

const ContentFeedPage = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [showClusterBar, setShowClusterBar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // クラスタのモックデータ
  const clusterList: Cluster[] = [
    { id: 'all', name: 'すべて' },
    { id: 'sf', name: 'SF' },
    { id: 'romance', name: 'ロマンス' },
    { id: 'fantasy', name: 'ファンタジー' },
    { id: 'horror', name: 'ホラー' },
    { id: 'mystery', name: 'ミステリー' },
    { id: 'action', name: 'アクション' },
    { id: 'comedy', name: 'コメディ' }
  ];

  // フィードデータの取得 (モック)
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        // 実際のAPIでは: const res = await fetch(`/api/feeds?cluster=${selectedCluster}&limit=20`);
        // タイムアウトで非同期をシミュレート
        setTimeout(() => {
          // モックデータ
          const mockFeed: FeedItem[] = [
            {
              feedId: 'feed1',
              contentId: 'content1',
              episodeId: 'episode1',
              title: '宇宙の果ての冒険',
              authorId: 'author1',
              authorName: '星野航',
              thumbnailUrl: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b',
              score: 85,
              pages: [
                'https://images.unsplash.com/photo-1581822261290-991b38693d1b',
                'https://images.unsplash.com/photo-1614732414444-096e5f1122d5',
                'https://images.unsplash.com/photo-1614314109185-987831d3d543',
                'https://images.unsplash.com/photo-1579033385971-a7bc8c5aad51'
              ]
            },
            {
              feedId: 'feed2',
              contentId: 'content2',
              episodeId: 'episode2',
              title: '時を超える想い',
              authorId: 'author2',
              authorName: '桜井美咲',
              thumbnailUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
              score: 92,
              pages: [
                'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
                'https://images.unsplash.com/photo-1516981442399-a91139e20ff8',
                'https://images.unsplash.com/photo-1607604278138-e5dc634b4e2a',
                'https://images.unsplash.com/photo-1518829501307-2b900b999fc8'
              ]
            },
            {
              feedId: 'feed3',
              contentId: 'content3',
              episodeId: 'episode3',
              title: '魔法学園の秘密',
              authorId: 'author3',
              authorName: '鈴木魔法',
              thumbnailUrl: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7',
              score: 78,
              pages: [
                'https://images.unsplash.com/photo-1551269901-5c5e14c25df7',
                'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1',
                'https://images.unsplash.com/photo-1532012197267-da84d127e765',
                'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'
              ]
            },
            {
              feedId: 'feed4',
              contentId: 'content4',
              episodeId: 'episode4',
              title: '幽霊屋敷の真実',
              authorId: 'author4',
              authorName: '幽霊ハンター',
              thumbnailUrl: 'https://images.unsplash.com/photo-1535957998253-26ae1ef29506',
              score: 88,
              pages: [
                'https://images.unsplash.com/photo-1535957998253-26ae1ef29506',
                'https://images.unsplash.com/photo-1533246880808-7701bfc490a2',
                'https://images.unsplash.com/photo-1518929458119-e5bf2ef23852',
                'https://images.unsplash.com/photo-1518890569493-668df9a00266'
              ]
            },
            {
              feedId: 'feed5',
              contentId: 'content5',
              episodeId: 'episode5',
              title: '謎の連続殺人事件',
              authorId: 'author5',
              authorName: '探偵K',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0',
              score: 95,
              pages: [
                'https://images.unsplash.com/photo-1579547945413-497e1b99dac0',
                'https://images.unsplash.com/photo-1588497859490-85d1c17db96d',
                'https://images.unsplash.com/photo-1505576633757-0ac1084f4754',
                'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1'
              ]
            }
          ];
          
          setFeedItems(mockFeed);
          setCurrentIndex(0);
          setLoading(false);
          
          // 初回ロード時のみスワイプヒントを表示
          setTimeout(() => {
            setShowSwipeHint(false);
          }, 3000);
        }, 1000);
      } catch (error) {
        console.error('フィードの取得に失敗しました', error);
        setLoading(false);
      }
    };

    fetchFeed();
  }, [selectedCluster]);

  // スワイプ関連の機能
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY: number = 0;
    let currentY: number = 0;
    let isDragging: boolean = false;
    let startTime: number = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      // スワイプ中はトランジションを無効にして、Y軸移動をそのまま反映
      if (Math.abs(deltaY) > 20) {
        container.style.transform = `translateY(${deltaY}px)`;
        container.style.transition = 'none';
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      const deltaY = currentY - startY;
      const swipeTime = Date.now() - startTime;
      const isQuickSwipe = swipeTime < 300;
      
      // スワイプの距離が十分であればカード切替
      if (deltaY < -50 || (isQuickSwipe && deltaY < -20)) { // 上にスワイプ
        goToNextCard();
      } else if (deltaY > 50 || (isQuickSwipe && deltaY > 20)) { // 下にスワイプ
        goToPrevCard();
      } else {
        // スワイプが不十分な場合は元の位置に戻す
        container.style.transform = 'translateY(0)';
        container.style.transition = 'transform 0.3s ease';
      }
      
      isDragging = false;
    };

    // ダブルタップでアクション（TikTok風)
    const handleDoubleTap = (() => {
      let lastTap = 0;
      
      return (e: TouchEvent) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
          // ダブルタップ検出
          const currentItem = feedItems[currentIndex];
          if (currentItem) {
            handleBoost(currentItem.contentId, currentItem.episodeId);
          }
          e.preventDefault();
        }
        
        lastTap = currentTime;
      };
    })();

    // イベントリスナーの登録
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchstart', handleDoubleTap as any);

    // クリーンアップ
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchstart', handleDoubleTap as any);
    };
  }, [currentIndex, feedItems]);

  // 次のカードへ移動 (上へスワイプ)
  const goToNextCard = () => {
    if (isTransitioning || currentIndex >= feedItems.length - 1) return;
    
    setIsTransitioning(true);
    
    if (containerRef.current) {
      containerRef.current.style.transform = 'translateY(-100%)';
      containerRef.current.style.transition = 'transform 0.3s ease';
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      
      if (containerRef.current) {
        containerRef.current.style.transform = 'translateY(0)';
        containerRef.current.style.transition = 'none';
      }
      
      setIsTransitioning(false);
      
      // 残り少なくなったらプリフェッチ
      if (currentIndex + 1 >= feedItems.length - 2) {
        fetchMoreItems();
      }
    }, 300);
  };

  // 前のカードへ移動 (下へスワイプ)
  const goToPrevCard = () => {
    if (isTransitioning || currentIndex <= 0) return;
    
    setIsTransitioning(true);
    
    if (containerRef.current) {
      containerRef.current.style.transform = 'translateY(100%)';
      containerRef.current.style.transition = 'transform 0.3s ease';
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1);
      
      if (containerRef.current) {
        containerRef.current.style.transform = 'translateY(0)';
        containerRef.current.style.transition = 'none';
      }
      
      setIsTransitioning(false);
    }, 300);
  };

  // 追加フィードのフェッチ (モック)
  const fetchMoreItems = async () => {
    // 実際のAPIでは: const res = await fetch(`/api/feeds?cluster=${selectedCluster}&cursor=${lastItemId}&limit=10`);
    console.log('More items would be fetched here...');
  };

  // アクションハンドラー
  const handleBoost = (contentId: ContentId, episodeId: EpisodeId) => {
    // 実際のAPIでは: fetch('/api/actions', { method: 'POST', body: JSON.stringify({ type: 'boost', contentId, episodeId }) })
    console.log(`Boosting content: ${contentId}, episode: ${episodeId}`);
  };

  const handleSave = (contentId: ContentId, episodeId: EpisodeId) => {
    // 実際のAPIでは: fetch('/api/actions', { method: 'POST', body: JSON.stringify({ type: 'save', contentId, episodeId }) })
    console.log(`Saving content: ${contentId}, episode: ${episodeId}`);
  };

  const handleComment = (contentId: ContentId, episodeId: EpisodeId) => {
    // コメント画面への遷移
    navigate(`/content/${contentId}/episode/${episodeId}/comments`);
  };

  const handleShare = (contentId: ContentId, episodeId: EpisodeId) => {
    // シェア処理
    const shareUrl = `${window.location.origin}/content/${contentId}/episode/${episodeId}`;
    
    // Web Share API があれば使用
    if (navigator.share) {
      navigator.share({
        title: 'Depend on You で見つけた作品',
        text: 'この作品がおすすめです！',
        url: shareUrl
      })
      .catch(error => console.error('シェアに失敗しました', error));
    } else {
      // クリップボードにコピー
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('リンクをクリップボードにコピーしました'))
        .catch(error => console.error('クリップボードへのコピーに失敗しました', error));
    }
  };

  // クラスタタブの切り替え
  const handleClusterChange = (clusterId: string) => {
    if (selectedCluster === clusterId) return;
    setSelectedCluster(clusterId);
    setShowClusterBar(false); // 選択後は閉じる
  };

  // トグルクラスターバー
  const toggleClusterBar = () => {
    setShowClusterBar(prev => !prev);
  };

  // 検索画面への遷移
  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black relative overflow-hidden">
      {/* TikTok風のトップバー - 最小限のUI */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3">
        <button 
          onClick={toggleClusterBar}
          className="text-white font-medium flex items-center space-x-1"
        >
          <span>{clusterList.find(c => c.id === selectedCluster)?.name || 'すべて'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showClusterBar ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <button 
          onClick={handleSearchClick}
          className="p-2 text-white"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
      {/* クラスタセレクター (TikTok風のオーバーレイメニュー) */}
      {showClusterBar && (
        <div className="absolute top-12 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800 py-3 px-2">
          <div className="grid grid-cols-3 gap-2">
            {clusterList.map(cluster => (
              <button
                key={cluster.id}
                onClick={() => handleClusterChange(cluster.id)}
                className={`py-2 px-1 rounded-lg text-sm ${
                  selectedCluster === cluster.id
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                {cluster.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* フィードエリア - フルスクリーン */}
      <div className="absolute inset-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : feedItems.length > 0 ? (
          <div 
            ref={containerRef}
            className="w-full h-full"
          >
            {/* 現在表示中のカード */}
            {feedItems[currentIndex] && (
              <FeedCard
                contentId={feedItems[currentIndex].contentId}
                episodeId={feedItems[currentIndex].episodeId}
                title={feedItems[currentIndex].title}
                authorId={feedItems[currentIndex].authorId}
                authorName={feedItems[currentIndex].authorName}
                thumbnailUrl={feedItems[currentIndex].thumbnailUrl}
                score={feedItems[currentIndex].score}
                selectedCluster={clusterList.find(c => c.id === selectedCluster)?.name}
                pages={feedItems[currentIndex].pages}
                onBoost={handleBoost}
                onSave={handleSave}
                onComment={handleComment}
                onShare={handleShare}
              />
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            コンテンツがありません
          </div>
        )}
      </div>
      
      {/* TikTok風のページインジケーター */}
      <div className="absolute bottom-4 right-4 z-30 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
        {currentIndex + 1} / {feedItems.length}
      </div>
    </div>
  );
};

export default ContentFeedPage; 