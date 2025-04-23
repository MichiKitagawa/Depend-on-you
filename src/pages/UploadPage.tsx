import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: 画像アップロード, 2: タイトル入力, 3: 確認

  // 画像ファイル選択ハンドラー
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles]);
      
      // プレビュー用のURL生成
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // 画像を選択ダイアログを開く
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 画像削除ハンドラー
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    // プレビューURLの解放
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // 画像並べ替えハンドラー
  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    const [movedImage] = newImages.splice(fromIndex, 1);
    const [movedPreview] = newPreviews.splice(fromIndex, 1);
    
    newImages.splice(toIndex, 0, movedImage);
    newPreviews.splice(toIndex, 0, movedPreview);
    
    setImages(newImages);
    setPreviews(newPreviews);
  };

  // 投稿ハンドラー
  const handleSubmit = async () => {
    if (images.length === 0 || !title.trim()) {
      alert('画像とタイトルは必須です');
      return;
    }

    setLoading(true);
    
    try {
      // 実際のAPIでは: 
      // 1. FormDataを使って画像をアップロード
      // 2. メタデータを含めて投稿APIを呼び出し
      console.log('投稿データ:', { title, images });
      
      // アップロード成功後、ホームにリダイレクト
      setTimeout(() => {
        setLoading(false);
        navigate('/', { state: { successMessage: '投稿が完了しました！' } });
      }, 1500);
    } catch (error) {
      console.error('投稿に失敗しました', error);
      setLoading(false);
      alert('投稿に失敗しました。もう一度お試しください。');
    }
  };

  // 次のステップに進む
  const goToNextStep = () => {
    if (step === 1 && images.length === 0) {
      alert('最低1枚の画像をアップロードしてください');
      return;
    }
    
    if (step === 2 && !title.trim()) {
      alert('タイトルは必須です');
      return;
    }
    
    setStep(prev => prev + 1);
  };

  // 前のステップに戻る
  const goToPrevStep = () => {
    setStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-black border-b border-gray-800 px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="text-white p-2"
          aria-label="戻る"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-lg font-bold">新規投稿</h1>
        <div className="w-8"></div> {/* バランス用の空div */}
      </header>

      {/* ステップインジケーター */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-400">ステップ {step}/3</div>
          <div className="text-sm text-gray-400">
            {step === 1 ? '画像アップロード' : step === 2 ? 'タイトル入力' : '確認'}
          </div>
        </div>
        <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="px-4 py-2">
        {/* ステップ1: 画像アップロード */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">画像をアップロード</h2>
            
            {/* 画像アップロードエリア */}
            <div 
              onClick={openFileDialog}
              className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="mt-2 text-gray-400">クリックして画像を選択</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF対応</p>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            
            {/* 画像プレビュー */}
            {previews.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">アップロード済み画像 ({previews.length})</h3>
                <p className="text-sm text-gray-400 mb-3">ドラッグして順序を変更できます</p>
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-[3/4] bg-gray-800 rounded-md overflow-hidden">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="bg-black/70 text-white p-1 rounded-full"
                          aria-label="画像を削除"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white px-2 py-0.5 text-xs rounded-full">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={goToNextStep}
                disabled={images.length === 0}
                className={`px-6 py-2 rounded-full font-medium ${
                  images.length > 0 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* ステップ2: タイトル入力 */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">タイトルを入力</h2>
            
            {/* タイトル */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="作品タイトルを入力"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={goToPrevStep}
                className="px-6 py-2 rounded-full border border-gray-600 text-white"
              >
                戻る
              </button>
              <button
                onClick={goToNextStep}
                disabled={!title.trim()}
                className={`px-6 py-2 rounded-full font-medium ${
                  title.trim() 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* ステップ3: 確認 */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">投稿内容の確認</h2>
            
            {/* 画像プレビュー */}
            <div className="mt-2 mb-6">
              <h3 className="text-lg font-medium mb-2">投稿画像 ({previews.length})</h3>
              <div className="grid grid-cols-3 gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-[3/4] bg-gray-800 rounded-md overflow-hidden">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/70 text-white px-2 py-0.5 text-xs rounded-full">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* タイトル確認 */}
            <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
              <div>
                <h3 className="text-sm text-gray-400">タイトル</h3>
                <p className="text-white font-medium">{title}</p>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={goToPrevStep}
                className="px-6 py-2 rounded-full border border-gray-600 text-white"
              >
                戻る
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 rounded-full font-medium ${
                  loading ? 'bg-gray-700 text-gray-400' : 'bg-primary text-white'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    投稿中...
                  </div>
                ) : '投稿する'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage; 