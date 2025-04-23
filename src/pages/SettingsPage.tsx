import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

type SettingsTab = 'profile' | 'dashboard' | 'notifications' | 'following' | 'account' | 'legal';

const SettingsPage = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  useEffect(() => {
    console.log('Current user state:', user)
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-dark">プロフィール設定</h2>
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user.avatarUrl || 'https://via.placeholder.com/100'}
                alt="プロフィール画像"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                画像を変更
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ユーザーネーム</label>
                <input
                  type="text"
                  defaultValue={user.username}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
                <textarea
                  rows={4}
                  placeholder="自己紹介を入力してください"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                保存する
              </button>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-dark">クリエイターダッシュボード</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2 text-dark">総閲覧数</h3>
                <p className="text-3xl font-bold text-dark">12,345</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2 text-dark">フォロワー</h3>
                <p className="text-3xl font-bold text-dark">987</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2 text-dark">作品数</h3>
                <p className="text-3xl font-bold text-dark">24</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2 text-dark">獲得いいね</h3>
                <p className="text-3xl font-bold text-dark">3,456</p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-dark">最近の統計</h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">グラフが表示されます</p>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-dark">通知設定</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-dark">新しいフォロワー</h3>
                  <p className="text-sm text-gray-500">新しいフォロワーの通知を受け取る</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-dark">コメント</h3>
                  <p className="text-sm text-gray-500">コンテンツへのコメント通知を受け取る</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-dark">いいね</h3>
                  <p className="text-sm text-gray-500">コンテンツへのいいね通知を受け取る</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-dark">システム通知</h3>
                  <p className="text-sm text-gray-500">重要なお知らせや更新情報を受け取る</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <h3 className="font-medium text-dark">メール通知</h3>
                  <p className="text-sm text-gray-500">重要な通知をメールでも受け取る</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'following':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-dark">フォロー管理</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://randomuser.me/api/portraits/women/12.jpg"
                    alt="フォロー中のユーザー"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-dark">佐藤花子</h3>
                    <p className="text-sm text-gray-500">@hanako_sato</p>
                  </div>
                </div>
                <button className="px-4 py-1 border border-gray-300 rounded-full hover:bg-gray-100 text-dark">
                  フォロー解除
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://randomuser.me/api/portraits/men/45.jpg"
                    alt="フォロー中のユーザー"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-dark">鈴木一郎</h3>
                    <p className="text-sm text-gray-500">@ichiro_suzuki</p>
                  </div>
                </div>
                <button className="px-4 py-1 border border-gray-300 rounded-full hover:bg-gray-100 text-dark">
                  フォロー解除
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://randomuser.me/api/portraits/women/32.jpg"
                    alt="フォロー中のユーザー"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-dark">田中美咲</h3>
                    <p className="text-sm text-gray-500">@misaki_tanaka</p>
                  </div>
                </div>
                <button className="px-4 py-1 border border-gray-300 rounded-full hover:bg-gray-100 text-dark">
                  フォロー解除
                </button>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-dark">アカウント管理</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-dark">メールアドレス変更</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">現在のメールアドレス</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">新しいメールアドレス</label>
                    <input
                      type="email"
                      placeholder="新しいメールアドレスを入力"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    メールアドレスを更新
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-3 text-dark">パスワード変更</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">現在のパスワード</label>
                    <input
                      type="password"
                      placeholder="現在のパスワード"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
                    <input
                      type="password"
                      placeholder="新しいパスワード"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード（確認）</label>
                    <input
                      type="password"
                      placeholder="新しいパスワードを再入力"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    パスワードを更新
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-3 text-red-600">アカウント削除</h3>
                <p className="text-sm text-gray-600 mb-3">
                  アカウントを削除すると、すべてのデータが完全に削除され、元に戻すことができません。
                </p>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  アカウントを削除する
                </button>
              </div>
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-dark">法的情報</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-dark">利用規約</h3>
                <p className="text-sm text-gray-600 mb-3">
                  当サービスの利用に関する規約を確認できます。最終更新日: 2023年10月1日
                </p>
                <a
                  href="#"
                  className="text-blue-500 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  利用規約を読む
                </a>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-dark">プライバシーポリシー</h3>
                <p className="text-sm text-gray-600 mb-3">
                  当サービスにおける個人情報の取り扱いについて確認できます。最終更新日: 2023年10月1日
                </p>
                <a
                  href="#"
                  className="text-blue-500 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  プライバシーポリシーを読む
                </a>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-dark">著作権ポリシー</h3>
                <p className="text-sm text-gray-600 mb-3">
                  当サービスの著作権に関するポリシーを確認できます。最終更新日: 2023年10月1日
                </p>
                <a
                  href="#"
                  className="text-blue-500 hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  著作権ポリシーを読む
                </a>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-light text-dark min-h-screen">
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        <h1 className="text-2xl font-bold mb-6 text-dark">設定</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* サイドバーナビゲーション */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-6">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50 text-dark'
                    }`}
                  >
                    プロフィール
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50 text-dark'
                    }`}
                  >
                    クリエイターダッシュボード
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      activeTab === 'notifications' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50 text-dark'
                    }`}
                  >
                    通知設定
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('following')}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      activeTab === 'following' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50 text-dark'
                    }`}
                  >
                    フォロー管理
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      activeTab === 'account' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50 text-dark'
                    }`}
                  >
                    アカウント管理
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('legal')}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      activeTab === 'legal' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50 text-dark'
                    }`}
                  >
                    利用規約・プライバシー
                  </button>
                </li>
                <li className="pt-4 mt-2 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    ログアウト
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          {/* メインコンテンツエリア */}
          <div className="w-full bg-white rounded-lg shadow p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 