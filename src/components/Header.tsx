import { useState } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 仮実装。実際にはログイン状態を管理するストアから取得

  return (
    <header className="bg-white shadow-sm">
      <nav className="container-custom py-4" aria-label="メインナビゲーション">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Depend on You</span>
          </Link>

          {/* デスクトップメニュー */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/discover" className="text-gray-700 hover:text-primary">
              探索
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/content/create" className="text-gray-700 hover:text-primary">
                  作品投稿
                </Link>
                <Link to="/profile/me" className="text-gray-700 hover:text-primary">
                  マイページ
                </Link>
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsLoggedIn(false)} // 仮実装
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary">
                  ログイン
                </Link>
                <Link to="/register" className="btn btn-primary">
                  新規登録
                </Link>
              </>
            )}
          </div>

          {/* モバイルメニューボタン */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">メニューを開く</span>
            {/* アイコン: メニュー/閉じる */}
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* モバイルメニュー */}
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}
          id="mobile-menu"
        >
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/discover"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            >
              探索
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/content/create"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  作品投稿
                </Link>
                <Link
                  to="/profile/me"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  マイページ
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsLoggedIn(false)} // 仮実装
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                >
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header 