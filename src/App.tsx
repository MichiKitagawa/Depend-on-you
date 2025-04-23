import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BottomNavigation from './components/BottomNavigation'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ContentDetailPage from './pages/ContentDetailPage'
import ContentEditPage from './pages/ContentEditPage'
import ProfilePage from './pages/ProfilePage'
import RankingPage from './pages/RankingPage'
import ContentFeedPage from './pages/ContentFeedPage'
import UploadPage from './pages/UploadPage'
import NotFoundPage from './pages/NotFoundPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* TikTok風のフルスクリーンフィードをデフォルトページに設定 */}
        <Route path="/" element={
          <>
            <ContentFeedPage />
            <BottomNavigation />
          </>
        } />
        <Route path="/feed" element={
          <>
            <ContentFeedPage />
            <BottomNavigation />
          </>
        } />
        
        {/* 投稿ページ */}
        <Route path="/upload" element={<UploadPage />} />
        
        {/* ランキングページ */}
        <Route path="/ranking" element={
          <>
            <RankingPage />
            <BottomNavigation />
          </>
        } />
        
        {/* プロフィールページ */}
        <Route path="/profile/:id" element={
          <>
            <ProfilePage />
            <BottomNavigation />
          </>
        } />

        {/* 設定ページ */}
        <Route path="/settings" element={
          <>
            <div className="pb-16">
              <SettingsPage />
            </div>
            <BottomNavigation />
          </>
        } />
        
        {/* 通知ページ */}
        <Route path="/notifications" element={
          <>
            <div className="flex-grow py-6 px-4">
              <h1 className="text-2xl font-bold mb-4">通知</h1>
              <div className="text-center text-gray-500 py-10">
                通知ページは開発中です
              </div>
            </div>
            <BottomNavigation />
          </>
        } />
        
        {/* 従来の通常レイアウトのページ */}
        <Route
          path="/home"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <HomePage />
              </main>
              <Footer />
            </>
          }
        />
        
        {/* 他のページ（ヘッダーとフッターあり） */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/content/:id" element={<ContentDetailPage />} />
                  <Route path="/content/create" element={<ContentEditPage />} />
                  <Route path="/content/edit/:id" element={<ContentEditPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App 