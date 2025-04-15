# dev_flow_guide

# 開発フロー & 自動化ガイド（Depend on You）

本ドキュメントは、あなたが望む開発スタイル：

- **1機能ずつの開発・テスト・マージの繰り返し**
- **自動テストによる品質保証**
- **無駄な手作業を極力排した開発サイクル**

を実現するための、**必要なドキュメント・設定・運用手順**をまとめたものです。

---

## ✅ 目標とする開発フロー

```
main（安定）
├─ feature/user-service
│   ├─ 開発（Cursorで進行）
│   ├─ 自動テスト実行（CIで）
│   ├─ ✅ テスト合格 → main にマージ
│   └─ ❌ テスト失敗 → 修正 → 再テスト
├─ feature/score-service
...

```

---

## 🧱 必要な構成ファイル一覧（自動生成可能）

| ファイル | 説明 |
| --- | --- |
| `.github/workflows/test.yml` | 全機能に対して Jest & Supertest を自動実行（CI） |
| `scripts/test.sh` | ローカルでも同じテスト実行ができる shell スクリプト |
| `test-report.md` | 失敗時に GitHub コメントへ自動投稿できるレポート雛形 |
| `.gitignore` | `node_modules/`, `.env`, `dist/` などの除外設定 |

---

## 🧭 あなたがやること（手順）

### Step 1. **リポジトリ準備**

- `git init` 済みのリポジトリで OK
- `main` ブランチを作成し初期ドキュメントを push

### Step 2. **CI 自動化ファイルの配置**

- `test.yml`, `test.sh` を `/scripts` および `/.github/workflows` に設置
- CI が有効な状態（GitHub 連携）なら push で発火

### Step 3. **開発・テストループ**

1. `main` から `feature/xxxx` ブランチを切る
2. Cursorでその機能を開発（`.md` を context として）
3. `npm run test`（ローカル） or push（CI）でテスト
4. ✅ 成功すれば PR → `main` にマージ
5. ❌ 失敗したら Cursor に返して修正指示（または手動修正）

### Step 4. **完了後、次のブランチを切って繰り返す**

---

## 🔁 推奨 CI のトリガー設定

- `on: push` → `feature/*`
- `on: pull_request` → `main`

---

## 🚀 これから生成するもの（順次）

- [ ]  `.github/workflows/test.yml`
- [ ]  `scripts/test.sh`
- [ ]  `.gitignore`
- [ ]  `test-report.md`

これらを順番に生成して整備していきます。
必要であれば「次」とお伝えください。