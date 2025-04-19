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
}

const HomePage = () => {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // API呼び出しをシミュレート
    const fetchContents = async () => {
      try {
        // 本来はAPIから取得
        setTimeout(() => {
          setContents([
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
              tags: ['初心者向け', 'ガイド', '創作']
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
              tags: ['イラスト', 'デジタルアート', 'チュートリアル']
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
              tags: ['小説', '執筆', 'キャラクター']
            }
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('コンテンツの取得に失敗しました', error)
        setLoading(false)
      }
    }

    fetchContents()
  }, [])

  return (
    <div className="container-custom py-8">
      {/* ヒーローセクション */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">あなたの創作をサポートする</h1>
        <p className="text-xl text-gray-600 mb-8">
          クリエイターとサポーターをつなぐ、新しいコンテンツプラットフォーム
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn btn-primary">
            新規登録して始める
          </Link>
          <Link to="/discover" className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
            コンテンツを探索する
          </Link>
        </div>
      </section>

      {/* フィードセクション */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">最新コンテンツ</h2>
          <Link to="/discover" className="text-primary hover:underline">
            もっと見る
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
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
                    <time dateTime={content.publishedAt}>
                      {new Date(content.publishedAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 特集セクション */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Depend on You の特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="text-primary text-3xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">時間を超えた評価</h3>
            <p className="text-gray-600">
              コンテンツがアップロード後も何度でも再評価される仕組みで、長期的な作品の価値を守ります。
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="text-primary text-3xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">共創するコミュニティ</h3>
            <p className="text-gray-600">
              読者がキュレーターとして作品価値を育て、クリエイターと一緒に新しい価値を生み出します。
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="text-primary text-3xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">行動の質を評価</h3>
            <p className="text-gray-600">
              単なるアクセス数ではなく、読者の行動の質と深さを重視し、ニッチな作品も正当に評価します。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage 