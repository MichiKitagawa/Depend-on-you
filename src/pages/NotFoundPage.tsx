import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="container-custom py-16 flex flex-col items-center justify-center text-center">
      <div className="text-primary text-9xl font-bold mb-4">404</div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4">ページが見つかりません</h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-lg">
        お探しのページは削除されたか、URLが変更された可能性があります。
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn btn-primary">
          ホームに戻る
        </Link>
        
        <Link to="/discover" className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
          コンテンツを探索する
        </Link>
      </div>
      
      <div className="mt-16 text-gray-400">
        <svg className="mx-auto w-24 h-24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  )
}

export default NotFoundPage 