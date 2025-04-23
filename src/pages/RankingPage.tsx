import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// マガジンの型定義
interface Magazine {
  id: string
  title: string
  description: string
  author: {
    id: string
    name: string
  }
  coverImage?: string
  rank: number
  previousRank?: number
  stats: {
    episodes: number
    views: number
    followers: number
  }
  isCompleted: boolean
}

const RankingPage = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [category, setCategory] = useState('all')
  const [rankingType, setRankingType] = useState<'popular' | 'trending' | 'new'>('popular')

  useEffect(() => {
    // API呼び出しをシミュレート
    const fetchRankings = async () => {
      setLoading(true)
      try {
        // 実際のAPIでは、timeRange, category, rankingTypeをパラメータとして渡して取得
        setTimeout(() => {
          // モックデータ
          const mockData: Magazine[] = [
            {
              id: 'm1',
              title: '宇宙の果ての冒険',
              description: '遠い未来、宇宙を探検する主人公の冒険を描くSF連載漫画。',
              author: {
                id: 'a1',
                name: '星野航'
              },
              coverImage: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b',
              rank: 1,
              previousRank: 2,
              stats: {
                episodes: 15,
                views: 235600,
                followers: 8570
              },
              isCompleted: false
            },
            {
              id: 'm2',
              title: '妖怪アパートメント',
              description: '様々な妖怪が住むアパートで暮らすことになった大学生の日常を描くコメディ漫画。',
              author: {
                id: 'a2',
                name: '幽霊屋敷'
              },
              coverImage: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
              rank: 2,
              previousRank: 1,
              stats: {
                episodes: 28,
                views: 198400,
                followers: 7450
              },
              isCompleted: false
            },
            {
              id: 'm3',
              title: '闇の探偵',
              description: '超常現象を専門とする探偵の事件解決を描くミステリー漫画。',
              author: {
                id: 'a3',
                name: '謎野真実'
              },
              coverImage: 'https://images.unsplash.com/photo-1535957998253-26ae1ef29506',
              rank: 3,
              previousRank: 5,
              stats: {
                episodes: 32,
                views: 175800,
                followers: 6320
              },
              isCompleted: true
            },
            {
              id: 'm4',
              title: '異世界転生ファンタジー',
              description: '交通事故で命を落とした主人公が魔法の世界に転生し冒険する物語。',
              author: {
                id: 'a4',
                name: '魔法使い'
              },
              coverImage: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
              rank: 4,
              previousRank: 3,
              stats: {
                episodes: 45,
                views: 165300,
                followers: 5980
              },
              isCompleted: false
            },
            {
              id: 'm5',
              title: '青春学園ドラマ',
              description: '高校生たちの恋と友情を描く青春ストーリー。',
              author: {
                id: 'a5',
                name: '恋愛マスター'
              },
              coverImage: 'https://images.unsplash.com/photo-1588492085785-5471f879c7a3',
              rank: 5,
              previousRank: 4,
              stats: {
                episodes: 24,
                views: 142700,
                followers: 5560
              },
              isCompleted: false
            },
            {
              id: 'm6',
              title: 'サイバーパンク2099',
              description: '未来都市を舞台にしたダークなサイバーパンク漫画。',
              author: {
                id: 'a6',
                name: 'サイバー太郎'
              },
              coverImage: 'https://images.unsplash.com/photo-1557838923-2985c318be48',
              rank: 6,
              previousRank: 8,
              stats: {
                episodes: 18,
                views: 128900,
                followers: 4870
              },
              isCompleted: false
            },
            {
              id: 'm7',
              title: 'ゾンビサバイバル日記',
              description: 'ゾンビに支配された世界での生存者たちの物語。',
              author: {
                id: 'a7',
                name: 'ゾンビハンター'
              },
              coverImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c',
              rank: 7,
              previousRank: 6,
              stats: {
                episodes: 36,
                views: 115200,
                followers: 4230
              },
              isCompleted: false
            },
            {
              id: 'm8',
              title: '料理の鉄人',
              description: '料理の腕を競い合う若きシェフたちのドラマチックな物語。',
              author: {
                id: 'a8',
                name: 'グルメ次郎'
              },
              coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f',
              rank: 8,
              previousRank: 10,
              stats: {
                episodes: 22,
                views: 104800,
                followers: 3950
              },
              isCompleted: false
            },
            {
              id: 'm9',
              title: '忍者学園物語',
              description: '現代に存在する秘密の忍者養成学校での若き忍者たちの物語。',
              author: {
                id: 'a9',
                name: '影の忍者'
              },
              coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
              rank: 9,
              previousRank: 7,
              stats: {
                episodes: 30,
                views: 98700,
                followers: 3680
              },
              isCompleted: false
            },
            {
              id: 'm10',
              title: '魔法動物園',
              description: '魔法の動物たちが暮らす不思議な動物園での冒険。',
              author: {
                id: 'a10',
                name: '魔法使いの弟子'
              },
              coverImage: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732',
              rank: 10,
              previousRank: 12,
              stats: {
                episodes: 14,
                views: 87300,
                followers: 3240
              },
              isCompleted: false
            }
          ]
          
          // フィルタと並び順の適用
          let filtered = [...mockData]
          
          // カテゴリフィルタ
          // 実際のAPIでは既にフィルタされたデータが返ってくる想定
          
          setMagazines(filtered)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error('ランキングの取得に失敗しました', error)
        setLoading(false)
      }
    }

    fetchRankings()
  }, [timeRange, category, rankingType])

  // カテゴリーリスト
  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'fantasy', name: 'ファンタジー' },
    { id: 'sf', name: 'SF' },
    { id: 'comedy', name: 'コメディ' },
    { id: 'romance', name: '恋愛' },
    { id: 'horror', name: 'ホラー' },
    { id: 'mystery', name: 'ミステリー' },
    { id: 'action', name: 'アクション' },
    { id: 'sports', name: 'スポーツ' }
  ]

  // 期間切り替え
  const handleTimeRangeChange = (range: 'daily' | 'weekly' | 'monthly') => {
    setTimeRange(range)
  }

  // カテゴリ切り替え
  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
  }

  // ランキングタイプ切り替え
  const handleRankingTypeChange = (type: 'popular' | 'trending' | 'new') => {
    setRankingType(type)
  }

  // ランク変動表示
  const renderRankChange = (current: number, previous?: number) => {
    if (!previous) return null
    
    if (current < previous) {
      return (
        <span className="text-green-500 text-xs flex items-center ml-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {previous - current}
        </span>
      )
    } else if (current > previous) {
      return (
        <span className="text-red-500 text-xs flex items-center ml-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {current - previous}
        </span>
      )
    } else {
      return (
        <span className="text-gray-500 text-xs flex items-center ml-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </span>
      )
    }
  }

  return (
    <div className="container-custom py-6">
      <h1 className="text-3xl font-bold mb-6">人気ランキング</h1>
      
      {/* タブ切り替え：期間 */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleTimeRangeChange('daily')}
            className={`py-2 px-4 font-medium text-sm ${
              timeRange === 'daily'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            デイリー
          </button>
          <button
            onClick={() => handleTimeRangeChange('weekly')}
            className={`py-2 px-4 font-medium text-sm ${
              timeRange === 'weekly'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ウィークリー
          </button>
          <button
            onClick={() => handleTimeRangeChange('monthly')}
            className={`py-2 px-4 font-medium text-sm ${
              timeRange === 'monthly'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            マンスリー
          </button>
        </div>
      </div>
      
      {/* ランキングタイプ切り替え */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => handleRankingTypeChange('popular')}
            className={`px-4 py-2 rounded-full text-sm ${
              rankingType === 'popular'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            人気順
          </button>
          <button
            onClick={() => handleRankingTypeChange('trending')}
            className={`px-4 py-2 rounded-full text-sm ${
              rankingType === 'trending'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            急上昇
          </button>
          <button
            onClick={() => handleRankingTypeChange('new')}
            className={`px-4 py-2 rounded-full text-sm ${
              rankingType === 'new'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            新着
          </button>
        </div>
      </div>
      
      {/* カテゴリー選択 */}
      <div className="mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                category === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* ランキング一覧 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : magazines.length > 0 ? (
        <div className="space-y-4">
          {magazines.map((magazine) => (
            <div 
              key={magazine.id} 
              className="flex border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* ランキング表示 */}
              <div className="flex-shrink-0 w-16 bg-gray-100 flex flex-col items-center justify-center p-2">
                <div className="flex items-center">
                  <span className={`text-2xl font-bold ${
                    magazine.rank <= 3 ? 'text-primary' : 'text-gray-700'
                  }`}>
                    {magazine.rank}
                  </span>
                  {renderRankChange(magazine.rank, magazine.previousRank)}
                </div>
                {magazine.rank <= 3 && (
                  <div className="mt-1">
                    {magazine.rank === 1 && (
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {magazine.rank === 2 && (
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {magazine.rank === 3 && (
                      <svg className="w-6 h-6 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              
              {/* マガジン情報 */}
              <div className="flex flex-grow">
                {magazine.coverImage && (
                  <Link to={`/magazine/${magazine.id}`} className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 overflow-hidden">
                    <img
                      src={magazine.coverImage}
                      alt={magazine.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                )}
                
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold mb-1">
                    <Link to={`/magazine/${magazine.id}`} className="hover:text-primary">
                      {magazine.title}
                    </Link>
                    {magazine.isCompleted && (
                      <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        完結
                      </span>
                    )}
                  </h3>
                  
                  <Link to={`/profile/${magazine.author.id}`} className="text-sm text-gray-600 hover:text-primary mb-2 inline-block">
                    {magazine.author.name}
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{magazine.description}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {magazine.stats.episodes}話
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {magazine.stats.views.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {magazine.stats.followers.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-500">該当するランキングデータがありません</p>
        </div>
      )}
    </div>
  )
}

export default RankingPage 