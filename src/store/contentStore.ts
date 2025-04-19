import { create } from 'zustand'

// コンテンツの型定義
export interface Content {
  id: string
  title: string
  excerpt: string
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

// コンテンツストアの状態の型定義
interface ContentState {
  contents: Content[]
  featuredContents: Content[]
  currentContent: Content | null
  isLoading: boolean
  error: string | null
  
  // アクション
  fetchContents: () => Promise<void>
  fetchContentById: (id: string) => Promise<void>
  fetchFeaturedContents: () => Promise<void>
  createContent: (data: Omit<Content, 'id' | 'publishedAt' | 'stats' | 'author'>, authorId: string) => Promise<string>
  updateContent: (id: string, data: Partial<Content>) => Promise<void>
  deleteContent: (id: string) => Promise<void>
  boostContent: (id: string) => Promise<void>
  saveContent: (id: string) => Promise<void>
  clearError: () => void
}

export const useContentStore = create<ContentState>((set, get) => ({
  contents: [],
  featuredContents: [],
  currentContent: null,
  isLoading: false,
  error: null,
  
  // コンテンツ一覧の取得
  fetchContents: async () => {
    try {
      set({ isLoading: true, error: null })
      
      // 実際のAPI呼び出しの代わりにモックデータを使用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockContents: Content[] = [
        {
          id: '1',
          title: 'クリエイティブな思考法：アイデアを生み出すための10のテクニック',
          excerpt: '創作活動において新しいアイデアを生み出すためのプラクティカルな方法をご紹介します。',
          content: `
          <p>創作活動において、新しいアイデアを生み出すことは最も重要なスキルの一つです。しかし、多くの人がアイデア出しの段階で行き詰まりを感じています。</p>
          
          <h2>1. 異なる分野を組み合わせる</h2>
          <p>まったく関係のない2つの分野やコンセプトを組み合わせることで、新しい視点が生まれます。例えば、伝統的な物語の構造と最新のAI技術を組み合わせるとどうなるでしょうか？</p>
          
          <h2>2. 制約を設ける</h2>
          <p>無限の可能性があると、かえって選択肢が多すぎて決められなくなります。自分に制約を課すことで、創造性が刺激されることがあります。例えば「3色だけで表現する」「500文字以内で書く」などのルールを設けてみましょう。</p>
          
          <h2>3. 日常の観察を習慣化する</h2>
          <p>周囲の世界を意識的に観察し、気になることをメモする習慣をつけましょう。電車での会話、街角の風景、何気ない出来事が素晴らしいアイデアのきっかけになることがあります。</p>
          `,
          coverImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32',
          author: {
            id: 'u1',
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
        },
        {
          id: '2',
          title: 'デジタル時代の物語作法：没入感を高める5つの要素',
          excerpt: 'オンラインで読まれる物語はどのような特性を持つべきか、その核心に迫ります。',
          content: `
          <p>デジタルメディアでの読書体験は、紙の本とは大きく異なります。読者の注意を引き、物語に没入させるためには、新しいアプローチが必要です。</p>
          
          <h2>1. 視覚的な区切り</h2>
          <p>スクリーン上のテキストは、適切な視覚的な区切りがないと読みづらくなります。短めの段落、効果的な見出し、そして時には視覚的な要素を取り入れることで、読者の目の負担を減らし、情報の整理を助けます。</p>
          
          <h2>2. インタラクティブな要素</h2>
          <p>デジタルならではの特性を活かし、適度なインタラクションを取り入れることで、読者の能動的な参加を促すことができます。</p>
          `,
          coverImage: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e',
          author: {
            id: 'u1',
            name: '山田太郎',
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
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
          content: `
          <p>継続的な創作活動は精神的な負担を伴いますが、適切なセルフケアによって燃え尽き症候群を防ぎ、創造性を維持することができます。</p>
          
          <h2>1. 創作と休息のリズムを作る</h2>
          <p>集中的な創作期間と意識的な休息期間を交互に設けることで、持続可能な創作サイクルを確立します。</p>
          
          <h2>2. 小さな成功を祝う</h2>
          <p>大きな目標だけでなく、日々の小さな進歩や成功を認識し、祝うことで、モチベーションを維持します。</p>
          `,
          author: {
            id: 'u2',
            name: '佐藤花子',
            avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
          },
          publishedAt: '2023-02-10T14:30:00Z',
          tags: ['メンタルヘルス', 'クリエイター', 'セルフケア'],
          stats: {
            views: 1120,
            saves: 124,
            boosts: 57
          }
        }
      ]
      
      set({ contents: mockContents, isLoading: false })
    } catch (error) {
      set({ 
        error: (error as Error).message || 'コンテンツの取得に失敗しました', 
        isLoading: false 
      })
    }
  },
  
  // 特定のコンテンツの取得
  fetchContentById: async (id: string) => {
    try {
      set({ isLoading: true, error: null, currentContent: null })
      
      // 実際のAPI呼び出しの代わりにモックデータを使用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 既存のコンテンツから検索
      const existingContent = get().contents.find(content => content.id === id)
      
      if (existingContent) {
        set({ currentContent: existingContent, isLoading: false })
        return
      }
      
      // コンテンツが見つからない場合は新しいモックデータを生成
      const mockContent: Content = {
        id,
        title: 'クリエイティブな思考法：アイデアを生み出すための10のテクニック',
        excerpt: '創作活動において新しいアイデアを生み出すためのプラクティカルな方法をご紹介します。',
        content: `
        <p>創作活動において、新しいアイデアを生み出すことは最も重要なスキルの一つです。しかし、多くの人がアイデア出しの段階で行き詰まりを感じています。</p>
        
        <h2>1. 異なる分野を組み合わせる</h2>
        <p>まったく関係のない2つの分野やコンセプトを組み合わせることで、新しい視点が生まれます。例えば、伝統的な物語の構造と最新のAI技術を組み合わせるとどうなるでしょうか？</p>
        
        <h2>2. 制約を設ける</h2>
        <p>無限の可能性があると、かえって選択肢が多すぎて決められなくなります。自分に制約を課すことで、創造性が刺激されることがあります。例えば「3色だけで表現する」「500文字以内で書く」などのルールを設けてみましょう。</p>
        
        <h2>3. 日常の観察を習慣化する</h2>
        <p>周囲の世界を意識的に観察し、気になることをメモする習慣をつけましょう。電車での会話、街角の風景、何気ない出来事が素晴らしいアイデアのきっかけになることがあります。</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32',
        author: {
          id: 'u1',
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
      }
      
      set({ currentContent: mockContent, isLoading: false })
    } catch (error) {
      set({ 
        error: (error as Error).message || 'コンテンツの取得に失敗しました', 
        isLoading: false 
      })
    }
  },
  
  // 注目コンテンツの取得
  fetchFeaturedContents: async () => {
    try {
      set({ isLoading: true, error: null })
      
      // 実際のAPI呼び出しの代わりにモックデータを使用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 既存のコンテンツから一部を特集コンテンツとして選択
      const existingContents = get().contents
      if (existingContents.length > 0) {
        set({ 
          featuredContents: existingContents.slice(0, 3), 
          isLoading: false 
        })
        return
      }
      
      // 既存のコンテンツがない場合は新しいモックデータを生成
      const mockFeaturedContents: Content[] = [
        {
          id: 'f1',
          title: '2023年注目のクリエイティブトレンド',
          excerpt: '今年最も影響力を持つと予想されるクリエイティブトレンドをご紹介します。',
          content: '...',
          coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
          author: {
            id: 'u3',
            name: '田中誠',
            avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg'
          },
          publishedAt: '2023-01-05T10:00:00Z',
          tags: ['トレンド', '2023年', 'クリエイティブ'],
          stats: {
            views: 2540,
            saves: 342,
            boosts: 128
          }
        },
        {
          id: 'f2',
          title: 'AI時代のコンテンツ制作：人間らしさを保つ方法',
          excerpt: 'AIツールを活用しながらも、人間らしい独自性を維持する方法について考察します。',
          content: '...',
          coverImage: 'https://images.unsplash.com/photo-1612815528866-7b0cd4e9cea1',
          author: {
            id: 'u4',
            name: '鈴木直樹',
            avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg'
          },
          publishedAt: '2023-02-18T14:30:00Z',
          tags: ['AI', 'コンテンツ制作', '創造性'],
          stats: {
            views: 1876,
            saves: 203,
            boosts: 95
          }
        },
        {
          id: 'f3',
          title: 'デジタルアートの始め方：初心者ガイド',
          excerpt: 'デジタルアートを始めたい人のための基礎知識と実践的なアドバイス。',
          content: '...',
          coverImage: 'https://images.unsplash.com/photo-1549281899-f75600a24107',
          author: {
            id: 'u5',
            name: '吉田美咲',
            avatarUrl: 'https://randomuser.me/api/portraits/women/67.jpg'
          },
          publishedAt: '2023-03-10T09:15:00Z',
          tags: ['デジタルアート', '初心者', 'チュートリアル'],
          stats: {
            views: 3210,
            saves: 567,
            boosts: 234
          }
        }
      ]
      
      set({ featuredContents: mockFeaturedContents, isLoading: false })
    } catch (error) {
      set({ 
        error: (error as Error).message || '特集コンテンツの取得に失敗しました', 
        isLoading: false 
      })
    }
  },
  
  // コンテンツの作成
  createContent: async (data, authorId) => {
    try {
      set({ isLoading: true, error: null })
      
      // 実際のAPI呼び出しの代わりにモックデータを使用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newId = Math.floor(Math.random() * 1000).toString()
      
      const newContent: Content = {
        id: newId,
        ...data,
        author: {
          id: authorId,
          name: '山田太郎', // 実際には認証済みユーザー情報から取得
          avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        publishedAt: new Date().toISOString(),
        stats: {
          views: 0,
          saves: 0,
          boosts: 0
        }
      }
      
      set(state => ({ 
        contents: [...state.contents, newContent],
        isLoading: false 
      }))
      
      return newId
    } catch (error) {
      set({ 
        error: (error as Error).message || 'コンテンツの作成に失敗しました', 
        isLoading: false 
      })
      return ''
    }
  },
  
  // コンテンツの更新
  updateContent: async (id, data) => {
    try {
      set({ isLoading: true, error: null })
      
      // 実際のAPI呼び出しの代わりにモックデータを使用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set(state => ({
        contents: state.contents.map(content => 
          content.id === id ? { ...content, ...data } : content
        ),
        currentContent: state.currentContent?.id === id 
          ? { ...state.currentContent, ...data } 
          : state.currentContent,
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: (error as Error).message || 'コンテンツの更新に失敗しました', 
        isLoading: false 
      })
    }
  },
  
  // コンテンツの削除
  deleteContent: async (id) => {
    try {
      set({ isLoading: true, error: null })
      
      // 実際のAPI呼び出しの代わりにモックデータを使用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      set(state => ({
        contents: state.contents.filter(content => content.id !== id),
        currentContent: state.currentContent?.id === id ? null : state.currentContent,
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: (error as Error).message || 'コンテンツの削除に失敗しました', 
        isLoading: false 
      })
    }
  },
  
  // コンテンツのブースト
  boostContent: async (id) => {
    try {
      // 実際のAPI呼び出しの代わりにモックデータを使用
      await new Promise(resolve => setTimeout(resolve, 300))
      
      set(state => ({
        contents: state.contents.map(content => 
          content.id === id 
            ? { ...content, stats: { ...content.stats, boosts: content.stats.boosts + 1 } } 
            : content
        ),
        currentContent: state.currentContent?.id === id 
          ? { ...state.currentContent, stats: { ...state.currentContent.stats, boosts: state.currentContent.stats.boosts + 1 } } 
          : state.currentContent
      }))
    } catch (error) {
      set({ 
        error: (error as Error).message || 'ブーストに失敗しました'
      })
    }
  },
  
  // コンテンツの保存
  saveContent: async (id) => {
    try {
      // 実際のAPI呼び出しの代わりにモックデータを使用
      await new Promise(resolve => setTimeout(resolve, 300))
      
      set(state => ({
        contents: state.contents.map(content => 
          content.id === id 
            ? { ...content, stats: { ...content.stats, saves: content.stats.saves + 1 } } 
            : content
        ),
        currentContent: state.currentContent?.id === id 
          ? { ...state.currentContent, stats: { ...state.currentContent.stats, saves: state.currentContent.stats.saves + 1 } } 
          : state.currentContent
      }))
    } catch (error) {
      set({ 
        error: (error as Error).message || '保存に失敗しました'
      })
    }
  },
  
  // エラーをクリア
  clearError: () => {
    set({ error: null })
  }
})) 