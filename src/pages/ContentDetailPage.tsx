import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// コンテンツの型定義
interface Content {
  id: string
  title: string
  content: string
  coverImage?: string
  author: {
    id: string
    name: string
    avatarUrl?: string
  }
  publishedAt: string
  tags: string[]
  stats: {
    views: number
    saves: number
    boosts: number
  }
}

// リアクションの型定義
interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'think' | 'sad'
  count: number
  active: boolean
}

const ContentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [reactions, setReactions] = useState<Reaction[]>([
    { type: 'like', count: 124, active: false },
    { type: 'love', count: 57, active: false },
    { type: 'laugh', count: 23, active: false },
    { type: 'think', count: 41, active: false },
    { type: 'sad', count: 8, active: false }
  ])

  useEffect(() => {
    // API呼び出しをシミュレート
    const fetchContent = async () => {
      try {
        // 実際のAPIからデータを取得する代わりにモックデータを使用
        setTimeout(() => {
          setContent({
            id: id || '1',
            title: 'クリエイティブな思考法：アイデアを生み出すための10のテクニック',
            content: `
            <p>創作活動において、新しいアイデアを生み出すことは最も重要なスキルの一つです。しかし、多くの人がアイデア出しの段階で行き詰まりを感じています。</p>
            
            <h2>1. 異なる分野を組み合わせる</h2>
            <p>まったく関係のない2つの分野やコンセプトを組み合わせることで、新しい視点が生まれます。例えば、伝統的な物語の構造と最新のAI技術を組み合わせるとどうなるでしょうか？</p>
            
            <h2>2. 制約を設ける</h2>
            <p>無限の可能性があると、かえって選択肢が多すぎて決められなくなります。自分に制約を課すことで、創造性が刺激されることがあります。例えば「3色だけで表現する」「500文字以内で書く」などのルールを設けてみましょう。</p>
            
            <h2>3. 日常の観察を習慣化する</h2>
            <p>周囲の世界を意識的に観察し、気になることをメモする習慣をつけましょう。電車での会話、街角の風景、何気ない出来事が素晴らしいアイデアのきっかけになることがあります。</p>
            
            <p>以上のようなテクニックを実践することで、アイデア創出のプロセスが改善され、より独創的な作品を生み出すことができるでしょう。重要なのは継続的な実践と、失敗を恐れない姿勢です。</p>
            `,
            coverImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32',
            author: {
              id: 'a1',
              name: '山田太郎',
              avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            publishedAt: '2023-04-15T12:00:00Z',
            tags: ['クリエイティブ', 'アイデア', '思考法', 'テクニック'],
            stats: {
              views: 1256,
              saves: 89,
              boosts: 42
            }
          })
          setLoading(false)
        }, 800)
      } catch (error) {
        console.error('コンテンツの取得に失敗しました', error)
        setLoading(false)
      }
    }

    fetchContent()
  }, [id])

  // リアクションのトグル処理
  const handleReaction = (reactionType: Reaction['type']) => {
    setReactions(reactions.map(reaction => {
      if (reaction.type === reactionType) {
        return {
          ...reaction,
          count: reaction.active ? reaction.count - 1 : reaction.count + 1,
          active: !reaction.active
        }
      }
      return reaction
    }))
  }

  // ブーストボタンの処理
  const handleBoost = () => {
    if (!content) return
    
    setContent({
      ...content,
      stats: {
        ...content.stats,
        boosts: content.stats.boosts + 1
      }
    })
  }

  // 保存ボタンの処理
  const handleSave = () => {
    if (!content) return
    
    setContent({
      ...content,
      stats: {
        ...content.stats,
        saves: content.stats.saves + 1
      }
    })
  }

  // 日付フォーマット関数
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

  if (!content) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">コンテンツが見つかりません</h2>
          <Link to="/" className="text-primary hover:underline">
            ホームページに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      {/* コンテンツヘッダー */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h1>
        
        {/* 著者情報と日付 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {content.author.avatarUrl && (
              <img 
                src={content.author.avatarUrl} 
                alt={content.author.name}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <Link to={`/profile/${content.author.id}`} className="font-medium hover:text-primary">
                {content.author.name}
              </Link>
              <div className="text-sm text-gray-500">
                {formatDate(content.publishedAt)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div>
              <span className="mr-1">👁️</span> {content.stats.views.toLocaleString()}
            </div>
            <div>
              <span className="mr-1">🔖</span> {content.stats.saves.toLocaleString()}
            </div>
            <div>
              <span className="mr-1">🚀</span> {content.stats.boosts.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* カバー画像 */}
      {content.coverImage && (
        <div className="mb-8">
          <img 
            src={content.coverImage} 
            alt={content.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-lg"
          />
        </div>
      )}
      
      {/* コンテンツ本文 */}
      <div 
        className="prose max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
      
      {/* アクションバー */}
      <div className="border-t border-b py-4 flex flex-wrap justify-between items-center gap-4">
        {/* リアクション */}
        <div className="flex gap-3">
          {reactions.map(reaction => (
            <button
              key={reaction.type}
              onClick={() => handleReaction(reaction.type)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                reaction.active 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span>
                {reaction.type === 'like' && '👍'}
                {reaction.type === 'love' && '❤️'}
                {reaction.type === 'laugh' && '😄'}
                {reaction.type === 'think' && '🤔'}
                {reaction.type === 'sad' && '😢'}
              </span>
              <span>{reaction.count}</span>
            </button>
          ))}
        </div>
        
        {/* アクションボタン */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            <span>🔖</span>
            <span>保存</span>
          </button>
          
          <button
            onClick={handleBoost}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg"
          >
            <span>🚀</span>
            <span>ブースト</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContentDetailPage 