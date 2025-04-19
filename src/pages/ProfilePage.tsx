import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

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
    contents: number
  }
  isFollowing: boolean
}

// コンテンツの型定義
interface Content {
  id: string
  title: string
  excerpt: string
  coverImage?: string
  publishedAt: string
  tags: string[]
  stats: {
    views: number
    saves: number
    boosts: number
  }
}

// ポートフォリオアクションの型定義
interface PortfolioAction {
  id: string
  type: 'boost' | 'save' | 'review'
  contentId: string
  contentTitle: string
  contentCover?: string
  date: string
  comment?: string
}

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'contents' | 'portfolio' | 'about'>('contents')
  const [user, setUser] = useState<User | null>(null)
  const [contents, setContents] = useState<Content[]>([])
  const [portfolioActions, setPortfolioActions] = useState<PortfolioAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ユーザー情報とコンテンツの取得をシミュレート
    const fetchUserData = async () => {
      try {
        // 実際にはAPIからデータを取得
        setTimeout(() => {
          setUser({
            id: id || 'u1',
            name: '山田太郎',
            username: 'taro_yamada',
            bio: 'デジタルクリエイター・作家。創作活動とテクノロジーの融合に関心があります。2019年からコンテンツ制作活動を開始し、現在は小説とデジタルアートを中心に活動しています。',
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
            coverUrl: 'https://images.unsplash.com/photo-1551292831-023188e78222',
            joinedAt: '2021-06-15T10:30:00Z',
            stats: {
              followers: 1248,
              following: 356,
              contents: 27
            },
            isFollowing: false
          })
          
          setContents([
            {
              id: '1',
              title: 'クリエイティブな思考法：アイデアを生み出すための10のテクニック',
              excerpt: '創作活動において新しいアイデアを生み出すためのプラクティカルな方法をご紹介します。',
              coverImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32',
              publishedAt: '2023-04-15T12:00:00Z',
              tags: ['クリエイティブ', 'アイデア', '思考法'],
              stats: {
                views: 1256,
                saves: 89,
                boosts: 42
              }
            },
            {
              id: '2',
              title: 'デジタル時代の物語作法：没入感を高める5つの要素',
              excerpt: 'オンラインで読まれる物語はどのような特性を持つべきか、その核心に迫ります。',
              coverImage: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e',
              publishedAt: '2023-03-22T09:15:00Z',
              tags: ['物語', 'デジタル', '執筆'],
              stats: {
                views: 854,
                saves: 62,
                boosts: 31
              }
            },
            {
              id: '3',
              title: '創作者のためのメンタルケア：燃え尽き症候群を防ぐ方法',
              excerpt: 'クリエイティブな活動を続けるために必要なセルフケアの方法について解説します。',
              publishedAt: '2023-02-10T14:30:00Z',
              tags: ['メンタルヘルス', 'クリエイター', 'セルフケア'],
              stats: {
                views: 1120,
                saves: 124,
                boosts: 57
              }
            }
          ])
          
          setPortfolioActions([
            {
              id: 'pa1',
              type: 'boost',
              contentId: 'c101',
              contentTitle: '短編小説の書き方：心に残る結末を作るテクニック',
              contentCover: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
              date: '2023-04-18T15:30:00Z'
            },
            {
              id: 'pa2',
              type: 'review',
              contentId: 'c102',
              contentTitle: 'AIと芸術の未来：人間の創造性はどう変わるのか',
              contentCover: 'https://images.unsplash.com/photo-1557838923-2985c318be48',
              date: '2023-04-12T09:45:00Z',
              comment: '非常に興味深い考察でした。AIツールを使いながらも人間らしい創造性を保つ方法について、新たな視点を得ることができました。'
            },
            {
              id: 'pa3',
              type: 'save',
              contentId: 'c103',
              contentTitle: 'デジタルイラストの配色テクニック：感情を伝える色彩理論',
              contentCover: 'https://images.unsplash.com/photo-1618331835717-801e976710b2',
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
                <span className="font-semibold">{user.stats.contents}</span> コンテンツ
              </div>
              <div>
                <span className="font-semibold">{user.stats.followers.toLocaleString()}</span> フォロワー
              </div>
              <div>
                <span className="font-semibold">{user.stats.following.toLocaleString()}</span> フォロー中
              </div>
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end md:items-end md:pb-4">
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
          </div>
        </div>
        
        {/* タブナビゲーション */}
        <div className="border-b mb-6">
          <nav className="flex">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'contents' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('contents')}
            >
              コンテンツ
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'portfolio' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('portfolio')}
            >
              ポートフォリオ
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
          {/* コンテンツタブ */}
          {activeTab === 'contents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">投稿したコンテンツ</h2>
                {user.id === 'u1' && (
                  <Link to="/content/create" className="btn btn-primary btn-sm">
                    新規作成
                  </Link>
                )}
              </div>
              
              {contents.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">まだコンテンツがありません</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contents.map((content) => (
                    <article key={content.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {content.coverImage && (
                        <Link to={`/content/${content.id}`} className="block">
                          <div className="relative h-48">
                            <img
                              src={content.coverImage}
                              alt={content.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                      )}
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {content.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          <Link to={`/content/${content.id}`} className="hover:text-primary">
                            {content.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">{content.excerpt}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <time dateTime={content.publishedAt}>
                            {formatDate(content.publishedAt)}
                          </time>
                          <div className="flex items-center gap-3">
                            <span title="閲覧数">👁️ {content.stats.views}</span>
                            <span title="保存数">🔖 {content.stats.saves}</span>
                            <span title="ブースト数">🚀 {content.stats.boosts}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
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
                          {action.type === 'boost' && '🚀'}
                          {action.type === 'save' && '🔖'}
                          {action.type === 'review' && '📝'}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {action.type === 'boost' && 'ブーストしました'}
                            {action.type === 'save' && '保存しました'}
                            {action.type === 'review' && 'レビューしました'}
                          </span>
                          <span className="text-sm text-gray-500">・ {formatDate(action.date)}</span>
                        </div>
                        
                        <div className="flex items-start gap-3 mt-2">
                          {action.contentCover && (
                            <Link to={`/content/${action.contentId}`} className="flex-shrink-0">
                              <img
                                src={action.contentCover}
                                alt={action.contentTitle}
                                className="w-20 h-20 object-cover rounded"
                              />
                            </Link>
                          )}
                          
                          <div>
                            <Link to={`/content/${action.contentId}`} className="font-medium hover:text-primary">
                              {action.contentTitle}
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
                      <span className="text-gray-500 w-32">投稿コンテンツ:</span>
                      <span>{user.stats.contents}</span>
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