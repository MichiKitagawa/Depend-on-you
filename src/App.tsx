import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ContentDetailPage from './pages/ContentDetailPage'
import ContentEditPage from './pages/ContentEditPage'
import ProfilePage from './pages/ProfilePage'
import DiscoveryPage from './pages/DiscoveryPage'
import ContentFeedPage from './pages/ContentFeedPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* TikTok風のフルスクリーンフィードをデフォルトページに設定 */}
        <Route path="/" element={<ContentFeedPage />} />
        <Route path="/feed" element={<ContentFeedPage />} />
        
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
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/discover" element={<DiscoveryPage />} />
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