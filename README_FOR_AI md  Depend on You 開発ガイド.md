## 環境設定

各サービスは`.env`ファイルと`.env.test`ファイルによって設定されます。セキュリティ上の理由から、これらのファイルはGitリポジトリには含まれていません。

### 環境変数の設定方法

1. 各サービスディレクトリにある`.env.example`ファイルと`.env.test.example`ファイルをコピーします：
   ```bash
   cp services/[service-name]/.env.example services/[service-name]/.env
   cp services/[service-name]/.env.test.example services/[service-name]/.env.test
   ```

2. コピーしたファイルに実際の値を設定します。例：
   ```
   DB_NAME=depend_db
   DB_USER=postgres
   DB_PASSWORD=your_secure_password
   ```

### 環境変数に関する注意事項

- **重要**: `.env`ファイルに記載された値はシステムの機密情報です。Gitにコミット・プッシュしないでください。
- 各開発者は自分の開発環境に合わせて環境変数を設定してください。
- CI/CD環境では、システム設定を通じて環境変数を設定してください。 