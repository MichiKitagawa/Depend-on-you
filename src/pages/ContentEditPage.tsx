import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface ContentFormData {
  title: string
  content: string
  coverImage: string
  tags: string[]
}

const ContentEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id
  
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    content: '',
    coverImage: '',
    tags: []
  })
  
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<ContentFormData>>({})

  useEffect(() => {
    if (isEditing) {
      // 編集モードの場合、既存のコンテンツデータを取得
      const fetchContent = async () => {
        try {
          // APIからのデータ取得をシミュレート
          setTimeout(() => {
            setFormData({
              title: 'クリエイティブな思考法：アイデアを生み出すための10のテクニック',
              content: `創作活動において、新しいアイデアを生み出すことは最も重要なスキルの一つです。しかし、多くの人がアイデア出しの段階で行き詰まりを感じています。

1. 異なる分野を組み合わせる
まったく関係のない2つの分野やコンセプトを組み合わせることで、新しい視点が生まれます。例えば、伝統的な物語の構造と最新のAI技術を組み合わせるとどうなるでしょうか？

2. 制約を設ける
無限の可能性があると、かえって選択肢が多すぎて決められなくなります。自分に制約を課すことで、創造性が刺激されることがあります。例えば「3色だけで表現する」「500文字以内で書く」などのルールを設けてみましょう。

3. 日常の観察を習慣化する
周囲の世界を意識的に観察し、気になることをメモする習慣をつけましょう。電車での会話、街角の風景、何気ない出来事が素晴らしいアイデアのきっかけになることがあります。`,
              coverImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32',
              tags: ['クリエイティブ', 'アイデア', '思考法', 'テクニック']
            })
            setLoading(false)
          }, 800)
        } catch (error) {
          console.error('コンテンツの取得に失敗しました', error)
          setLoading(false)
        }
      }

      fetchContent()
    }
  }, [id, isEditing])

  // フォームの入力変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // タグの追加
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }))
      }
      setTagInput('')
    }
  }

  // タグの削除
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // フォームの検証
  const validateForm = (): boolean => {
    const newErrors: Partial<ContentFormData> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'コンテンツは必須です'
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = '少なくとも1つのタグを追加してください'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    
    try {
      // API送信をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 保存成功後、詳細ページに遷移
      const newId = isEditing ? id : Math.floor(Math.random() * 1000).toString()
      navigate(`/content/${newId}`)
    } catch (error) {
      console.error('コンテンツの保存に失敗しました', error)
      setSaving(false)
    }
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

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? 'コンテンツを編集' : '新しいコンテンツを作成'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* タイトル */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="コンテンツのタイトルを入力"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        
        {/* カバー画像 URL */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
            カバー画像 URL
          </label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="画像のURLを入力（省略可）"
          />
          
          {formData.coverImage && (
            <div className="mt-2">
              <img 
                src={formData.coverImage} 
                alt="プレビュー"
                className="w-full max-h-[200px] object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x400?text=画像URLが無効です'
                }}
              />
            </div>
          )}
        </div>
        
        {/* タグ */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            タグ <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.tags ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="タグを入力してEnterキーを押す"
          />
          {errors.tags && (
            <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enterキーを押して複数のタグを追加できます
          </p>
        </div>
        
        {/* コンテンツ本文 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="コンテンツの内容を入力"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content}</p>
          )}
        </div>
        
        {/* ボタン */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                保存中...
              </span>
            ) : isEditing ? '更新する' : '作成する'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContentEditPage 