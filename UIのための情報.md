具体例（テンプレート）：

フロントエンド設計依頼

【プロジェクト概要】
- 名称：Depend on You
- 目的：クリエイターとサポーターをつなぐコンテンツプラットフォーム
- ターゲット：コンテンツ制作者、コンテンツ消費者
- 特徴：ユーザーの行動履歴をポートフォリオ化、フィードカスタマイズ機能

【技術スタック希望】
- フレームワーク：React + TypeScript
- CSSフレームワーク：Tailwind CSS
- 状態管理：Zustand
- ルーティング：React Router
- API連携：Axios

【デザイン要件】
- スタイル：モダンでクリーンなUI
- カラー：ブランドカラーは（具体的な色を指定）
- レスポンシブ：モバイル、タブレット、デスクトップすべて対応
- 参考サイト：Medium、Patreon、Substack（UIの良いところを取り入れたい）

【主要画面】
1. ホーム/フィード画面
2. ユーザー登録/ログイン画面
3. コンテンツ詳細画面
4. コンテンツ作成/編集画面
5. ユーザープロフィール/ポートフォリオ画面
6. ディスカバリー（コンテンツ発見）画面

【APIエンドポイント情報】
- ユーザー認証：POST /api/users/login, /api/users/register
- コンテンツ管理：GET/POST /contents, GET /contents/:id
- アクション：POST /actions
- ポートフォリオ：GET /portfolios/:userId
- フィード：GET /feeds/latest?userId=xxx

【その他の要件】
- ダークモード対応
- 多言語対応の考慮
- アクセシビリティ対応（WCAG 2.1 AA準拠）