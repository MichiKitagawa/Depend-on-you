import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ロゴとミッション */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-xl font-bold">Depend on You</Link>
            <p className="mt-2 text-gray-400">
              クリエイターとサポーターをつなぐコンテンツプラットフォーム
            </p>
          </div>

          {/* リンク集1 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">プラットフォーム</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/discover" className="text-gray-400 hover:text-white">
                  探索
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  Depend on Youについて
                </Link>
              </li>
              <li>
                <Link to="/creators" className="text-gray-400 hover:text-white">
                  クリエイター一覧
                </Link>
              </li>
            </ul>
          </div>

          {/* リンク集2 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">サポート</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white">
                  ヘルプセンター
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">
                  利用規約
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Depend on You. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 