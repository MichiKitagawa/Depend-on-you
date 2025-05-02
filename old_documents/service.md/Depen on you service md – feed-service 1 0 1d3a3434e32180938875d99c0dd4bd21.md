# Depen on you service.md – feed-service 1.0

# [service.md](http://service.md/) – feed-service

## サービス名

feed-service

## 概要

ranking-service や user-service の情報を元に、読者ごとにパーソナライズされたフィード（単話・連載のおすすめ）を生成・提供する。

リアルタイム性と個別最適化の両立を目指す表示系サービス。

## 主な責務

- クラスタ・スコア・過去閲覧履歴に基づく表示内容の選定
- 単話形式・シリーズ形式など表示種別の切り替え
- 再評価対象作品の差し込み（archive-service）

## 管理対象データ（抽象）

- ユーザーID、表示候補作品リスト
- フィード生成ログ、表示履歴

## 連携先サービス

- **ranking-service**：表示対象作品の取得
- **content-service**：作品情報（タイトル・画像等）の取得
- **archive-service**：再配信対象の挿入
- **curation-service**：プレイリスト・推薦情報の反映

## 備考

- 表示速度・表示順制御・A/Bテスト対応など、UX最適化を意識した設計が必要。