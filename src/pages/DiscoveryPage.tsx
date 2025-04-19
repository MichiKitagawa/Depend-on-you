import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// 仮のコンテンツデータ型
interface Content {
  id: string
  title: string
  excerpt: string
  author: {
    id: string
    name: string
  }
  coverImage?: string
  publishedAt: string
  tags: string[]
  rating: number
  viewCount: number
}

const DiscoveryPage = () => {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('trending') // trending, latest, rating
  const [category, setCategory] = useState('all')

  useEffect(() => {
    // API呼び出しをシミュレート
    const fetchContents = async () => {
      setLoading(true)
      try {
        // 実際のAPIでは、filter, categoryをパラメータとして渡して検索
        setTimeout(() => {
          // モックデータ
          const mockData: Content[] = [
            {
              id: '1',
              title: '創作活動を始める方法：初心者ガイド',
              excerpt: '創作活動を始めるのに必要な心構えと実践的なステップを解説します。',
              author: {
                id: 'a1',
                name: '山田太郎'
              },
              coverImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634',
              publishedAt: '2023-04-15T12:00:00Z',
              tags: ['初心者向け', 'ガイド', '創作'],
              rating: 4.7,
              viewCount: 1200
            },
            {
              id: '2',
              title: 'デジタルイラストの描き方：プロのテクニック',
              excerpt: 'プロのイラストレーターが教える効率的なデジタルイラストの描き方。',
              author: {
                id: 'a2',
                name: '佐藤花子'
              },
              coverImage: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea',
              publishedAt: '2023-04-12T09:30:00Z',
              tags: ['イラスト', 'デジタルアート', 'チュートリアル'],
              rating: 4.9,
              viewCount: 3500
            },
            {
              id: '3',
              title: '小説執筆のコツ：魅力的なキャラクター作り',
              excerpt: '読者の心を掴む魅力的なキャラクターを作るための実践的なアドバイス。',
              author: {
                id: 'a3',
                name: '田中誠'
              },
              publishedAt: '2023-04-10T15:45:00Z',
              tags: ['小説', '執筆', 'キャラクター'],
              rating: 4.5,
              viewCount: 980
            },
            {
              id: '4',
              title: '音楽制作の基礎：DAWの使い方',
              excerpt: 'デジタルオーディオワークステーションを使った音楽制作の基本を解説。',
              author: {
                id: 'a4',
                name: '鈴木健太'
              },
              coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
              publishedAt: '2023-04-08T10:15:00Z',
              tags: ['音楽', 'DAW', '制作'],
              rating: 4.3,
              viewCount: 750
            },
            {
              id: '5',
              title: 'マンガの描き方：コマ割りのコツ',
              excerpt: '読者を引き込むマンガのコマ割りテクニックを解説します。',
              author: {
                id: 'a5',
                name: '高橋真理'
              },
              coverImage: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5',
              publishedAt: '2023-04-05T14:30:00Z',
              tags: ['マンガ', 'コマ割り', 'ストーリーテリング'],
              rating: 4.8,
              viewCount: 2100
            },
            {
              id: '6',
              title: 'プログラミングで作る創作支援ツール',
              excerpt: 'プログラミングの基礎から始めて、自分の創作活動を効率化するツールを作る方法。',
              author: {
                id: 'a6',
                name: '木村隆'
              },
              publishedAt: '2023-04-01T09:00:00Z',
              tags: ['プログラミング', 'ツール開発', '効率化'],
              rating: 4.6,
              viewCount: 1670
            }
          ]
          
          // フィルタと並び順の適用
          let filtered = [...mockData]
          
          // カテゴリフィルタ
          if (category !== 'all') {
            filtered = filtered.filter(content => 
              content.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
            )
          }
          
          // 並び順
          switch (filter) {
            case 'latest':
              filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              break
            case 'rating':
              filtered.sort((a, b) => b.rating - a.rating)
              break
            case 'trending':
            default:
              filtered.sort((a, b) => b.viewCount - a.viewCount)
              break
          }
          
          setContents(filtered)
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error('コンテンツの取得に失敗しました', error)
        setLoading(false)
      }
    }

    fetchContents()
  }, [filter, category])

  // カテゴリーリスト
  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'illustration', name: 'イラスト' },
    { id: 'novel', name: '小説' },
    { id: 'music', name: '音楽' },
    { id: 'manga', name: 'マンガ' },
    { id: 'programming', name: 'プログラミング' }
  ]

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">コンテンツを探索</h1>
      
      {/* フィルターとカテゴリー選択 */}
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="flex space-x-2 mb-4 md:mb-0 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
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
        
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
          >
            <option value="trending">トレンド順</option>
            <option value="latest">新着順</option>
            <option value="rating">評価順</option>
          </select>
        </div>
      </div>
      
      {/* コンテンツ一覧 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : contents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <article key={content.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {content.coverImage && (
                <div className="relative h-48">
                  <img
                    src={content.coverImage}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center">
                    <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {content.rating.toFixed(1)}
                  </div>
                </div>
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
                  <Link to={`/profile/${content.author.id}`} className="hover:text-primary">
                    {content.author.name}
                  </Link>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {content.viewCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>該当するコンテンツが見つかりませんでした</p>
        </div>
      )}
    </div>
  )
}

export default DiscoveryPage 