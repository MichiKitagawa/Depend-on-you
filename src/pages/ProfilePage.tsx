import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

// ユーザー情報の型定義
interface User {
  id: string
  name: string
  username: string
  bio: string
  avatarUrl: string
  coverUrl?: string
  joinedAt: string
  stats: {
    followers: number
    following: number
    magazines: number
  }
  isFollowing: boolean
}

// マガジンの型定義
interface Magazine {
  id: string
  title: string
  description: string
  coverImage?: string
  createdAt: string
  updatedAt: string
  episodeCount: number
  isCompleted: boolean
  isFollowing: boolean
  stats: {
    followers: number
    views: number
  }
}

// エピソードの型定義
interface Episode {
  id: string
  title: string
  coverImage?: string
  publishedAt: string
  orderIndex: number
  stats: {
    views: number
  }
}

// ポートフォリオアクションの型定義
interface PortfolioAction {
  id: string
  type: 'follow' | 'read' | 'review'
  magazineId: string
  magazineTitle: string
  magazineCover?: string
  date: string
  comment?: string
}

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'magazines' | 'portfolio' | 'about'>('magazines')
  const [user, setUser] = useState<User | null>(null)
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [portfolioActions, setPortfolioActions] = useState<PortfolioAction[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // ユーザー情報とマガジンの取得をシミュレート
    const fetchUserData = async () => {
      try {
        // 実際にはAPIからデータを取得
        setTimeout(() => {
          setUser({
            id: id || 'u1',
            name: '山田太郎',
            username: 'taro_yamada',
            bio: '漫画クリエイター。SF、ファンタジー、ホラーが得意。2019年からコンテンツ制作活動を開始し、現在は3つの連載を持っています。',
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
            coverUrl: 'https://images.unsplash.com/photo-1551292831-023188e78222',
            joinedAt: '2021-06-15T10:30:00Z',
            stats: {
              followers: 1248,
              following: 356,
              magazines: 3
            },
            isFollowing: false
          })
          
          setMagazines([
            {
              id: 'm1',
              title: '宇宙の果ての冒険',
              description: '遠い未来、宇宙を探検する主人公の冒険を描くSF連載漫画。毎週月曜更新。',
              coverImage: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b',
              createdAt: '2022-01-15T12:00:00Z',
              updatedAt: '2023-04-10T09:15:00Z',
              episodeCount: 15,
              isCompleted: false,
              isFollowing: true,
              stats: {
                followers: 857,
                views: 23560
              }
            },
            {
              id: 'm2',
              title: '妖怪アパートメント',
              description: '様々な妖怪が住むアパートで暮らすことになった大学生の日常を描くコメディ漫画。隔週金曜更新。',
              coverImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
              createdAt: '2022-05-20T14:30:00Z',
              updatedAt: '2023-03-24T10:45:00Z',
              episodeCount: 8,
              isCompleted: false,
              isFollowing: false,
              stats: {
                followers: 523,
                views: 12480
              }
            },
            {
              id: 'm3',
              title: '闇の探偵',
              description: '超常現象を専門とする探偵の事件解決を描くミステリー漫画。完結済み。',
              coverImage: 'https://images.unsplash.com/photo-1535957998253-26ae1ef29506',
              createdAt: '2021-11-05T16:20:00Z',
              updatedAt: '2022-09-15T11:30:00Z',
              episodeCount: 12,
              isCompleted: true,
              isFollowing: false,
              stats: {
                followers: 642,
                views: 18920
              }
            }
          ])
          
          setPortfolioActions([
            {
              id: 'pa1',
              type: 'follow',
              magazineId: 'm101',
              magazineTitle: '異世界転生ファンタジー',
              magazineCover: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
              date: '2023-04-18T15:30:00Z'
            },
            {
              id: 'pa2',
              type: 'review',
              magazineId: 'm102',
              magazineTitle: '未来都市サイバー',
              magazineCover: 'https://images.unsplash.com/photo-1557838923-2985c318be48',
              date: '2023-04-12T09:45:00Z',
              comment: '素晴らしい世界観とキャラクター設定。次回の更新が楽しみです！'
            },
            {
              id: 'pa3',
              type: 'read',
              magazineId: 'm103',
              magazineTitle: '青春学園ドラマ',
              magazineCover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2',
              date: '2023-04-05T18:20:00Z'
            }
          ])
          
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error('ユーザーデータの取得に失敗しました', error)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  // マガジン選択時のエピソード取得
  const handleMagazineSelect = (magazine: Magazine) => {
    setSelectedMagazine(magazine)
    
    // エピソードデータ取得のシミュレーション
    const fetchEpisodes = async () => {
      try {
        // 実際にはAPIからデータを取得
        setTimeout(() => {
          const mockEpisodes: Episode[] = Array.from({ length: magazine.episodeCount }, (_, i) => ({
            id: `e${i+1}`,
            title: `${magazine.title} 第${i+1}話`,
            coverImage: magazine.coverImage,
            publishedAt: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString(), // 一週間ごとに古く
            orderIndex: magazine.episodeCount - i,
            stats: {
              views: Math.floor(Math.random() * 2000) + 500
            }
          }));
          
          setEpisodes(mockEpisodes);
        }, 400);
      } catch (error) {
        console.error('エピソードの取得に失敗しました', error);
      }
    };
    
    fetchEpisodes();
  };

  // マガジンのフォロー/フォロー解除の処理
  const handleMagazineFollowToggle = (magazineId: string) => {
    setMagazines(magazines.map(mag => {
      if (mag.id === magazineId) {
        return {
          ...mag,
          isFollowing: !mag.isFollowing,
          stats: {
            ...mag.stats,
            followers: mag.isFollowing ? mag.stats.followers - 1 : mag.stats.followers + 1
          }
        };
      }
      return mag;
    }));
  };

  // フォロー/フォロー解除の処理
  const handleFollowToggle = () => {
    if (!user) return
    
    setUser({
      ...user,
      isFollowing: !user.isFollowing,
      stats: {
        ...user.stats,
        followers: user.isFollowing ? user.stats.followers - 1 : user.stats.followers + 1
      }
    })
  }

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // マガジン一覧に戻る
  const handleBackToMagazines = () => {
    setSelectedMagazine(null);
  };

  // 自分のプロフィールかどうかをチェック
  const isOwnProfile = user?.id === 'u1';  // 現在のユーザーIDを 'u1' と仮定

  // 設定ページへ移動
  const navigateToSettings = () => {
    navigate('/settings');
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">ユーザーが見つかりません</h2>
          <Link to="/" className="text-primary hover:underline">
            ホームページに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* カバー画像 */}
      <div className="relative w-full h-64 bg-gray-200">
        {user.coverUrl ? (
          <img 
            src={user.coverUrl} 
            alt="Profile cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-light to-primary opacity-30"></div>
        )}
      </div>
      
      <div className="container-custom">
        {/* プロフィールヘッダー */}
        <div className="relative flex flex-col md:flex-row -mt-16 mb-6">
          <div className="z-10 mx-auto md:mx-0 mb-4 md:mb-0">
            <img 
              src={user.avatarUrl} 
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md"
            />
          </div>
          
          <div className="flex-grow text-center md:text-left md:ml-6 md:mt-16">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.name}</h1>
            <p className="text-gray-600 mb-3">@{user.username}</p>
            
            <div className="flex justify-center md:justify-start gap-4 text-sm mb-4">
              <div>
                <span className="font-semibold">{user.stats.magazines}</span> マガジン
              </div>
              <div>
                <span className="font-semibold">{user.stats.followers.toLocaleString()}</span> フォロワー
              </div>
              <div>
                <span className="font-semibold">{user.stats.following.toLocaleString()}</span> フォロー中
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isOwnProfile ? (
              <>
                <button
                  onClick={navigateToSettings}
                  className="px-6 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  設定
                </button>
              </>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  user.isFollowing 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {user.isFollowing ? 'フォロー中' : 'フォローする'}
              </button>
            )}
          </div>
        </div>
        
        {/* タブナビゲーション */}
        <div className="border-b mb-6">
          <nav className="flex">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'magazines' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('magazines')}
            >
              マガジン
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'portfolio' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('portfolio')}
            >
              活動履歴
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'about' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('about')}
            >
              プロフィール
            </button>
          </nav>
        </div>
        
        {/* タブコンテンツ */}
        <div className="pb-12">
          {/* マガジンタブ */}
          {activeTab === 'magazines' && (
            <div>
              {selectedMagazine ? (
                // 選択されたマガジンのエピソード一覧表示
                <div>
                  <div className="mb-6">
                    <button 
                      onClick={handleBackToMagazines}
                      className="flex items-center text-gray-600 hover:text-primary mb-4"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      マガジン一覧に戻る
                    </button>
                    
                    <div className="flex flex-col md:flex-row gap-6 bg-gray-50 rounded-lg p-6 mb-6">
                      {selectedMagazine.coverImage && (
                        <div className="md:flex-shrink-0">
                          <img 
                            src={selectedMagazine.coverImage} 
                            alt={selectedMagazine.title} 
                            className="w-full md:w-48 h-64 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      )}
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">{selectedMagazine.title}</h2>
                            {selectedMagazine.isCompleted && (
                              <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mb-3 inline-block">
                                完結済み
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleMagazineFollowToggle(selectedMagazine.id)}
                            className={`px-4 py-1 rounded-full text-sm font-medium ${
                              selectedMagazine.isFollowing 
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                                : 'bg-primary text-white hover:bg-primary-dark'
                            }`}
                          >
                            {selectedMagazine.isFollowing ? 'フォロー中' : 'フォローする'}
                          </button>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{selectedMagazine.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">エピソード数:</span> {selectedMagazine.episodeCount}
                          </div>
                          <div>
                            <span className="text-gray-500">フォロワー:</span> {selectedMagazine.stats.followers.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-gray-500">総閲覧数:</span> {selectedMagazine.stats.views.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-gray-500">最終更新:</span> {formatDate(selectedMagazine.updatedAt)}
                          </div>
                        </div>
                        
                        {user.id === 'u1' && (
                          <Link 
                            to={`/magazine/${selectedMagazine.id}/edit`}
                            className="text-primary hover:underline text-sm font-medium"
                          >
                            マガジンを編集
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">エピソード一覧</h3>
                  
                  <div className="space-y-4">
                    {episodes.map((episode) => (
                      <Link 
                        key={episode.id}
                        to={`/content/${selectedMagazine.id}/episode/${episode.id}`}
                        className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {episode.coverImage && (
                            <div className="sm:w-24 h-24 sm:h-auto bg-gray-200">
                              <img 
                                src={episode.coverImage} 
                                alt={episode.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="p-4 flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="text-lg font-medium mb-1">{episode.title}</h4>
                              <p className="text-gray-500 text-sm">公開日: {formatDate(episode.publishedAt)}</p>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                              <span>第{episodes.length - episodes.indexOf(episode)}話</span>
                              <span>閲覧数: {episode.stats.views.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                // マガジン一覧表示
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">マガジン一覧</h2>
                    {user.id === 'u1' && (
                      <Link to="/magazine/create" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                        新規マガジン作成
                      </Link>
                    )}
                  </div>
                  
                  {magazines.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">まだマガジンがありません</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {magazines.map((magazine) => (
                        <div 
                          key={magazine.id} 
                          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div 
                            onClick={() => handleMagazineSelect(magazine)}
                            className="cursor-pointer"
                          >
                            <div className="relative h-48 bg-gray-200">
                              {magazine.coverImage && (
                                <img
                                  src={magazine.coverImage}
                                  alt={magazine.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {magazine.isCompleted && (
                                <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                  完結済み
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="text-lg font-semibold mb-2">{magazine.title}</h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{magazine.description}</p>
                              <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{magazine.episodeCount}話</span>
                                <span>更新: {formatDate(magazine.updatedAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 pb-4 pt-2 border-t flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              <span>{magazine.stats.followers.toLocaleString()} フォロワー</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMagazineFollowToggle(magazine.id);
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                magazine.isFollowing 
                                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                                  : 'bg-primary text-white hover:bg-primary-dark'
                              }`}
                            >
                              {magazine.isFollowing ? 'フォロー中' : 'フォローする'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* ポートフォリオタブ */}
          {activeTab === 'portfolio' && (
            <div>
              <h2 className="text-xl font-bold mb-6">活動履歴</h2>
              
              {portfolioActions.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">まだアクティビティがありません</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {portfolioActions.map((action) => (
                    <div key={action.id} className="flex gap-4 border-b pb-6">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                          {action.type === 'follow' && '👥'}
                          {action.type === 'read' && '📖'}
                          {action.type === 'review' && '📝'}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {action.type === 'follow' && 'フォローしました'}
                            {action.type === 'read' && '読みました'}
                            {action.type === 'review' && 'レビューしました'}
                          </span>
                          <span className="text-sm text-gray-500">・ {formatDate(action.date)}</span>
                        </div>
                        
                        <div className="flex items-start gap-3 mt-2">
                          {action.magazineCover && (
                            <Link to={`/magazine/${action.magazineId}`} className="flex-shrink-0">
                              <img
                                src={action.magazineCover}
                                alt={action.magazineTitle}
                                className="w-20 h-20 object-cover rounded"
                              />
                            </Link>
                          )}
                          
                          <div>
                            <Link to={`/magazine/${action.magazineId}`} className="font-medium hover:text-primary">
                              {action.magazineTitle}
                            </Link>
                            
                            {action.comment && (
                              <p className="text-gray-600 mt-2 text-sm">
                                "{action.comment}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* プロフィールタブ */}
          {activeTab === 'about' && (
            <div>
              <h2 className="text-xl font-bold mb-4">プロフィール</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700 whitespace-pre-line">{user.bio}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">基本情報</h3>
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="text-gray-500 w-32">ユーザー名:</span>
                      <span>@{user.username}</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-500 w-32">登録日:</span>
                      <span>{formatDate(user.joinedAt)}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">活動統計</h3>
                  <ul className="space-y-2">
                    <li className="flex">
                      <span className="text-gray-500 w-32">マガジン数:</span>
                      <span>{user.stats.magazines}</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-500 w-32">フォロワー:</span>
                      <span>{user.stats.followers.toLocaleString()}</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-500 w-32">フォロー中:</span>
                      <span>{user.stats.following.toLocaleString()}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 